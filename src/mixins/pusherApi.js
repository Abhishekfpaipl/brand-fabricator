// import Pusher from 'pusher-js';

// const pusherApi = {
//     data() {
//         return {
//             pusher: null
//         };
//     },
//     methods: {
//         debounce(func, wait) {
//             let timeout;
//             return function () {
//                 const context = this;
//                 const args = arguments;
//                 const later = function () {
//                     timeout = null;
//                     func.apply(context, args);
//                 };
//                 clearTimeout(timeout);
//                 timeout = setTimeout(later, wait);
//             };
//         },
//         connect(callApi) {
//             if (this.pusher) {
//                 // Disconnect Pusher if it's already connected
//                 this.pusher.disconnect();
//             }

//             this.pusher = new Pusher('376226d34fa363ee0c8d', {
//                 cluster: 'ap2',
//                 debug: true
//             });

//             const channel = this.pusher.subscribe('fpaipl-channel');

//             // Unbind any existing event handlers
//             channel.unbind('fpaipl-event');

//             // Debounce the API call to ensure it only happens once within 1 second
//             const debouncedCallApi = this.debounce(() => {
//                 this.$store.dispatch(callApi)
//                     .then(() => {
//                         // Reconnect Pusher after the API call is complete
//                         this.pusher.connect();
//                         console.log('connected');
//                     })
//                     .catch((error) => {
//                         // Handle API call error
//                         console.error('API call error:', error);
//                         // Reconnect Pusher even if there was an error
//                         this.pusher.connect();
//                     });
//             }, 1000);

//             channel.bind('fpaipl-event', debouncedCallApi);
//         }
//     }
// };

// export default pusherApi;


import Pusher from 'pusher-js'
const pusherApi = {

    methods: {
        connect(callApi) { 
            const pusher = new Pusher('376226d34fa363ee0c8d', {
                cluster: 'ap2',
                debug:true
            });
            const channel = pusher.subscribe('fpaipl-channel');
            channel.bind('fpaipl-event', () => { 
                this.$store.dispatch(callApi);
                console.log('connected')
            });
        }
    }
}
export default pusherApi