<template>
    <div v-if="ledgerChats" class="d-flex flex-column justify-content-between h-100">
        <div class="ps-0 py-2 shadow d-flex justify-content-between align-items-center">
            <div v-if="ledgerChats.ledger" class="d-flex justify-content-start align-items-center">
                <router-link :to="'/running-orders/' + ledger_sid" class="btn">
                    <i class="bi bi-chevron-left"></i>
                </router-link>
                <span class="modal-title">{{ ledgerChats.ledger.name }}</span>
            </div>
            <div v-if="ledgerChats.pagination" class="d-flex aling-items-center">
                <button type="button" class="btn" @click="toggleChatOpacity">
                    <i class="bi bi-eye"></i>
                </button>
                <button v-if="page <= ledgerChats.pagination.lastPage" class="btn" @click="loadChats">
                    <i class="bi bi-arrow-clockwise pe-2"></i>
                </button>
            </div>
        </div>
        <div v-if="ledgerChats.ledger && ledgerChats.ledger.stock" class="flex-fill bg-fullscreen p-0 reversed-list"
            :style="{ 'background-image': 'url(' + ledgerChats.ledger.stock.product.preview + ')' }"
            style="height: calc(100vh - 110px); overflow-y: scroll;">
            <ul class="list-group">
                <li class="list-group-item bg-transparent border-0 py-1" v-for="(chat, msgIndex) in ledgerChats.chats"
                    data-bs-toggle="offcanvas" data-bs-target="#ledgerChatInfoModal"
                    :data-bs-chat-id="chat.id" aria-controls="ledgerChatInfoModal" :key="msgIndex">
                    <div class="d-flex flex-column text-right p-1 rounded-3" style="max-width: 80%; width: fit-content;"
                        :style="{
                            'border-bottom-left-radius': !chat.myChat ? '0 !important' : '',
                            'border-bottom-right-radius': chat.myChat ? '0 !important' : ''
                        }" :class="{
    'align-items-end ms-auto': chat.myChat,
    'align-items-start': !chat.myChat,
    [chatOpacity(chat.myChat)]: true
}">
                        <div class="smaller text-bg-dark px-3 text-capitalize rounded-pill">
                            {{ chat.sender_id.name }} | {{ chat.model }}
                        </div>
                        <div class="px-1 rounded" :class="{ 'text-end': chat.myChat, 'text-start': !chat.myChat }">
                            <span v-if="chat.type === 'text'">{{ chat.content }}</span>
                            <span v-if="chat.type === 'audio'">
                                <audio :ref="`audioPlayer-${msgIndex}`" :src="chat.content" controls></audio>
                            </span>
                            <span v-if="chat.type === 'image'">
                                <img :src="chat.content" style="height: 250px; object-fit: contain;">
                            </span>
                            <span v-if="chat.type === 'pdf'">
                                <a :download="chat.content" class="btn btn-dark" :href="chat.content">Download
                                    Pdf</a>
                            </span>
                        </div>
                        <div class="ms-2 text-muted smaller">{{ formatMessageTime(chat.delivered_at) }}</div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="p-0">
            <div class="d-flex w-100 m-0 align-items-center">
                <textarea v-model="body" rows="2" class="form-control rounded-0 flex-fill"
                    placeholder="Type your message..." required>
                </textarea>
                <div class="btn-group dropup h-100">
                    <!-- <button class="btn btn-secondary rounded-0" style="width: 60px; height: 60px"
                        @mousedown="toggleRecording" @mouseup="toggleRecording">
                        <div class="d-flex flex-column justify-content-center align-items-center h-100">
                            <i v-if="!isRecording" class="bi bi-mic fs-5"></i>
                            <i v-if="isRecording" class="bi bi-mic-fill fs-5"></i>
                        </div>
                    </button>
                    <button class="btn btn-warning" data-bs-toggle="dropdown">
                        <i class="bi bi-paperclip fs-1"></i>
                    </button>
                    <ul class="dropdown-menu">
                        <li class="dropdown-item border-bottom" @click="openCamera">
                            <i class="bi bi-camera"></i>
                            <span>Camera</span>
                        </li>
                        <li class="dropdown-item border-bottom" @click="triggerFileUpload('image')">
                            <i class="bi bi-image"></i>
                            <span>Image Upload</span>
                        </li>
                        <li class="dropdown-item border-bottom">
                            <i class="bi bi-mic"></i>
                            <span>Voice Message</span>
                        </li>
                        <li class="dropdown-item" @click="triggerFileUpload('pdf')">
                            <i class="bi bi-file-pdf"></i>
                            <span>Upload Pdf</span>
                        </li>
                    </ul> -->
                    <button @click="sendMessage" class="btn btn-dark rounded-0 px-3"><i
                            class="bi bi-send-fill fs-4"></i></button>
                </div>
            </div>
        </div>
        <LedgerChatInfo :chats="ledgerChats.chats"/>
    </div>
    <p v-else>Loading .....</p>
</template>

<script>
import axiosInstance from '@/axiosInstance';
import LedgerChatInfo from '@/components/LedgerChatInfo.vue';
import axios from 'axios';
export default {
    name: 'ChatModel',
    components: {
        LedgerChatInfo
    },
    data() {
        return {
            opacity: true,
            body: '',
            ledger_sid: '',
            previewUrl: '',
            isImage: true,
            error: '',
            fileType: '',
            isRecording: false,
            audioChunks: [],
            mediaRecorder: null,
            audioPlayer: null,
            page: 1,
            isFetching: false,
            test: [],
        }
    },
    mounted() {
        this.ledger_sid = this.$route.params.ledger_sid
        this.loadChats();
    },
    computed: {
        ledgerChats() {
            return this.$store.getters.getLedgerChats
        }
    },
    methods: {
        async loadChats() {
            if (this.isFetching) return;
            if (this.ledgerChats && this.ledgerChats.pagination) {
                if (this.page > this.ledgerChats.pagination.lastPage) return;
            }

            this.isFetching = true;
            // Method to load chats

            await this.$store.dispatch('fetchLedgerChats', {
                ledger_sid: this.ledger_sid,
                page: this.page
            }).then(() => {
                // Action completed: increment the page for pagination
                this.page++;

                // Reset isFetching to false as data loading is complete
                this.isFetching = false;
            }).catch((error) => {
                // Handle any errors that occur during the fetch
                console.error('Error fetching chats:', error);

                // Reset isFetching to false even if there is an error
                this.isFetching = false;
            });

            // const token = localStorage.getItem('token');
            // axiosInstance.get(`chats/${this.ledger_sid}?page=${this.page}`, {
            //     headers: { "Authorization": `Bearer ${token}` }
            // }).then((response) => {
            //     if (response.data.status === 'ok') {
            //         const currentChats = this.chats;
            //         this.chats = [...response.data.data.chats, ...currentChats];
            //         this.ledger = response.data.data.ledger;
            //         this.pagination = response.data.data.pagination;
            //         this.page++;
            //         this.isFetching = false;                   
            //     } else if (response.data.status === 'error') {
            //         this.isFetching = false;
            //         alert(response.data.message);
            //     } else {
            //         this.isFetching = false;
            //         alert('Something went wrong! Please try again');
            //     }
            // });
        },

        toggleChatOpacity() {
            this.opacity = !this.opacity;
        },
        chatOpacity(myChat) {
            let classx = this.opacity ? 'show' : 'hide';
            if (myChat) {
                return 'my-chat-' + classx;
            } else {
                return 'other-chat-' + classx;
            }
        },
        formatMessageTime(time) {
            const options = {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            const formattedTime = new Date(time).toLocaleDateString('en-US', options);
            return formattedTime;
        },
        sendMessage() {
            const token = localStorage.getItem('token');
            axiosInstance.post('chats',
                {
                    type: 'text',
                    content: this.body,
                    ledger_sid: this.ledger_sid,
                }, {
                headers: { "Authorization": `Bearer ${token}` }
            }).then((res) => {
                console.log(res.data)
                this.body = ''
            });
        },

        async openCamera() {
            try {
                // Always prompt for camera permission
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });

                // Get the video element reference
                const videoElement = this.$refs.cameraVideo;

                // Check if the browser supports the srcObject property
                if ('srcObject' in videoElement) {
                    // Stop the current stream before assigning the new stream
                    if (videoElement.srcObject) {
                        const tracks = videoElement.srcObject.getTracks();
                        tracks.forEach((track) => track.stop());
                    }

                    videoElement.srcObject = stream;
                } else {
                    // For older browsers, use the URL.createObjectURL method
                    videoElement.src = window.URL.createObjectURL(stream);
                }
                // Play the video
                videoElement.play();
            } catch (error) {
                console.error('Error accessing camera:', error);

                this.error = 'Error accessing camera. Please check your camera permissions.';
            }
        },

        triggerFileUpload(fileType) {
            this.fileType = fileType;
            const fileInput = this.$refs.fileInput;

            if (fileInput) {
                fileInput.accept = fileType === 'image' ? 'image/*' : 'application/pdf';
                fileInput.click();
            } else {
                console.error('File input element is undefined.');
            }
        },

        captureImage() {
            const videoElement = this.$refs.cameraVideo;
            const canvas = document.createElement('canvas');
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            canvas.getContext('2d').drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            this.previewUrl = canvas.toDataURL('image/png');
            this.fileType = 'image';
            this.stopCamera();
        },

        stopCamera() {
            const videoElement = this.$refs.cameraVideo;
            if ('srcObject' in videoElement) {
                const stream = videoElement.srcObject;
                const tracks = stream.getTracks();
                tracks.forEach((track) => track.stop());
                videoElement.srcObject = null;
            }
        },

        previewFile(event) {
            this.error = '';
            const file = event.target.files[0];
            if (!file) {
                return;
            }
            if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
                this.error = 'File must be an image or a PDF.';
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                this.error = 'File size should not exceed 5MB.';
                return;
            }
            this.isImage = file.type.startsWith('image/');
            this.fileType = this.isImage ? 'image' : 'pdf';
            this.previewUrl = URL.createObjectURL(file);
        },
        toggleRecording() {
            if (this.isRecording) {
                this.stopRecording();
            } else {
                this.startRecording();
            }
        },
        startRecording() {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then((stream) => {
                    this.mediaRecorder = new MediaRecorder(stream);
                    this.audioChunks = [];

                    this.mediaRecorder.ondataavailable = (event) => {
                        if (event.data.size > 0) {
                            this.audioChunks.push(event.data);
                        }
                    };

                    this.mediaRecorder.onstop = async () => {
                        const audioBlob = new Blob(this.audioChunks, { type: 'audio/mp3' });
                        const audioUrl = URL.createObjectURL(audioBlob);
                        const formData = new FormData();
                        formData.append('audio', audioBlob, 'recording.mp3');
                        formData.append('message', 'chat audio');
                        formData.append('ledger_sid', 'DG-L-0001');

                        try {
                            const response = await axios.post('http://192.168.1.133:8001/api/chats', formData, {
                                headers: { 'Accept': 'application/json', 'Content-Type': 'multipart/form-data' }
                            });
                            this.chats.push(response.data.data);
                            const newChatIndex = this.chats.length - 1;
                            const newAudioPlayerRef = `audioPlayer-${newChatIndex}`;
                            this.$nextTick(() => {
                                if (this.$refs[newAudioPlayerRef] && this.$refs[newAudioPlayerRef][0]) {
                                    this.$refs[newAudioPlayerRef][0].src = audioUrl;
                                }
                            });
                            this.$forceUpdate();
                            console.log('Server response:', response.data);
                        } catch (error) {
                            console.error('Error uploading file:', error);
                        }

                        this.isRecording = false;
                    };

                    this.mediaRecorder.start();
                    this.isRecording = true;
                })
                .catch((error) => {
                    console.error('Error accessing microphone:', error);
                });
        },
        stopRecording() {
            if (this.mediaRecorder) {
                this.mediaRecorder.stop();
            }
        },
    },
}
</script>

<style>
/* .audio-container {
    /* max-width: 400px;/ */
/* margin: auto; */
/* padding: 20px; 
} */

.audio-controls {
    margin-bottom: 10px;
}

.my-chat-show {
    background-color: #83d1ba;
}

.other-chat-show {
    background-color: #ffffff;
}

.my-chat-hide {
    background-color: #20c99710;
}

.other-chat-hide {
    background-color: #dddddd10;
}

.reversed-list {
    display: flex;
    flex-direction: column-reverse;
}
</style>