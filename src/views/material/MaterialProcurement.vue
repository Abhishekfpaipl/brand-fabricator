<template>
    <nav class="navbar border-bottom navbar-expand-lg" style="background-color: #25C297;">
        <div class="container-fluid">
            <router-link to="/material/accepted" class="ps-1 pe-3 text-white">
                <i class="bi bi-chevron-left"></i>
            </router-link>
            <div class="navbar-brand flex-fill d-flex align-items-center gap-2 text-white">
                <span>Material</span>
                <i class="bi bi-arrow-right"></i>
                <small>{{ this.poId }}</small>
            </div>
        </div>
    </nav>
    <div class="container" style="padding-bottom: 60px;">
        <div class="p-2 rounded-top-2 mt-3 bg-light text-dark border" style="background-color: #28CC9E;" type="button">
            <div class="d-flex justify-content-between w-100" @click="toggleOrder" data-bs-toggle="collapse"
                href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
                <div class="d-flex">
                    <div>
                        <img v-if="dataSet.colors" :src="dataSet.colors[0].image"
                            style="height: 60px; width: 60px; object-fit: cover; object-position: top;" class="rounded-2">
                    </div>
                    <div>
                        <b class="ms-2">{{ dataSet && dataSet.jwoi }}</b>
                        <b class="ms-2 fs-5">{{ dataSet.name }}</b>
                        <p class="ms-2 fs-5" v-if="dataSet && dataSet.quantity"> {{ dataSet.quantity }} pcs</p>
                    </div>
                </div>
                <div class="d-flex align-items-center">
                    <i :class="iconClassOrder"></i>
                    <!-- <i class="bi bi-chevron-down mx-2 fs-5" data-bs-toggle="collapse" href="#collapseExample" role="button"
                        aria-expanded="false" aria-controls="collapseExample"></i> -->
                </div>
            </div>
        </div>
        <div class="collapse" id="collapseExample">
            <img v-if="dataSet.colors" :src="dataSet.colors[0].image" style="width:100%; object-fit: fill;"
                class="rounded-0 p-2">
            <table class="table table-bordered  table-hover ">
                <tbody>
                    <tr>
                        <th scope="row">Name</th>
                        <td class="text-muted w-50">{{ dataSet.name }}</td>
                    </tr>
                    <tr>
                        <th scope="row">Fc / Piece</th>
                        <td class="text-muted">{{ dataSet.fc }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-for="(so, soIndex) in sos" :key="soIndex" class="">
            <div v-if="so.stock_id"
                class="d-flex justify-content-between align-items-center border py-3 p-2 text-dark bg-light my-2 w-100 rounded-top"
                data-bs-toggle="collapse" :data-bs-target="'#fabric' + soIndex" aria-expanded="false"
                :aria-controls="'fabric' + soIndex" style="background-color: #28CC9E;" @click="toggle">
                <span>{{ so.stock_id.name }} #{{ so.sid }}</span>
                <span>
                    <i :class="iconClass"></i>
                </span>
                <!-- <span v-if="so.fabricStatus" class="text-success">Accepted <i class="bi bi-check fs-4"></i></span> -->
            </div>
            <div class="collapse show my-2" :id="'fabric' + soIndex">
                <div class="d-flex justify-content-between mb-2 px-2">
                    <p class="mb-0 fw-bold">Color</p>
                    <p class="mb-0 fw-bold">Quantity</p>
                    <p class="mb-0 fw-bold">Unit</p>
                </div>
                <div v-for="(color, colorIndex) in so.items" :key="colorIndex" class="d-flex gap-3 m-2">
                    <!-- <div class="rounded-circle " style="width: 45px; height: 35px;"
                        :style="'background-color :' + color.color">
                    </div> -->
                    <img :src="color.image" class="rounded-circle" style="width: 45px; height: 45px; object-fit: fill;">
                    <input type="number" class="form-control form-control-sm border-0 text-center" v-model="color.quantity"
                        readonly>
                    <span>{{ so.stock_id.unit }}</span>
                </div>
                <div class="d-flex gap-2 justify-content-between p-2 border-top">
                    <p>Total</p>
                    <p>{{ calculateTotal(so.items) }}</p>
                    <!-- <p>{{ calculateTotal(so.items).toFixed(2) }}</p> -->
                    <span>{{ so.stock_id.unit }}</span>
                </div>
            </div>
        </div>
        <button v-if="sos.length && sos[0].pending === 'pending' && !hideButton" class="btn top-brand w-100"
            @click="acceptFabric" :disabled="buttonDisabled">Record
            Fabric Purchase</button>
    </div> 
</template>

<script>
import axios from 'axios';
import sweetAlert from '@/mixins/sweetAlert';
export default {
    mixins: [sweetAlert],
    data() {
        return {
            dataSet: {},
            poId: '',
            isExpanded: false,
            isExpandedOrder: false,
            buttonDisabled: false,
            hideButton: false,
        };
    },
    watch: {
        dataSet: {
            immediate: true,
            handler(newValue) {
                if (newValue) {
                    // console.log('data here', newValue);
                    this.fetchSaleOrder(newValue.sid, newValue.fabricator_sid);
                }
            }
        }
    },
    mounted() {
        this.poId = this.$route.params.poId;
        axios.get('http://192.168.1.133:8001/api/purchaseorders/' + this.poId).then(response => {
            this.dataSet = response.data.data;
        })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    },
    computed: {
        sos() {
            return this.$store.getters.getSaleOrder;
        },
        iconClass() {
            return this.isExpanded ? "bi bi-chevron-up" : "bi bi-chevron-down";
        },
        iconClassOrder() {
            return this.isExpandedOrder ? "bi bi-chevron-up" : "bi bi-chevron-down";
        },
    },
    methods: {
        showSuccessAlert() {
            this.showSweetAlert('Yay', 'Fabric has been purchased');
        },
        showErrorAlert() {
            this.showSweetError('Oops', 'Something went wrong');
        },
        toggle() {
            this.isExpanded = !this.isExpanded;
        },
        toggleOrder() {
            this.isExpandedOrder = !this.isExpandedOrder;
        },
        calculateTotal(items) {
            return items.reduce((total, color) => total + parseFloat(color.quantity), 0);
        },
        fetchSaleOrder(jwoId, fabId) {
            if (jwoId && fabId) {
                this.$store.dispatch('fetchSaleOrder', {
                    jwoId: jwoId,
                    fabId: fabId
                });
            }
        },
        acceptFabric() {
           this.buttonDisabled = true;
            let so_sids = this.sos.map(so => so.sid);
            axios.post('http://192.168.1.133:8003/api/sales', {
                po_sid: this.$route.params.poId,
            })
                .then(response => {
                    if (response.data.status === 'ok') {
                        console.log(so_sids)
                        axios.post(`http://192.168.1.133:8002/api/purchases`, {
                            po_sid: this.$route.params.poId,
                            so_sids: JSON.stringify(so_sids)
                        })
                            .then(response => {
                                if (response.data.status === 'ok') {
                                    axios.put('http://192.168.1.133:8001/api/purchaseorders/' + this.poId, {
                                        status: 'next'
                                    }).then(response => {
                                        console.log('status changed', response.data);
                                        this.showSuccessAlert();
                                    })
                                }
                            })
                        console.log(response.data.data)
                        // this.$router.push('/cutting-department')
                    } else if (response.data.status === 'error') {
                        this.showErrorAlert();
                        alert(response.data.message)
                    } else {
                        this.showErrorAlert();
                        alert('Something went wrong! Please try again')
                    }
                })
                .catch((error) => {
                    console.error('error creating data', error);
                    this.showErrorAlert();
                })
                .finally(() => {
                    // this.buttonDisabled = false;
                    this.hideButton = true
                });
        }
    },
}
</script>
