// import Pusher from 'pusher-js'
const pusherApi = {

    methods: {
        connect(callApi) {
            console.log(callApi)
            // const pusher = new Pusher('ba095b8c30f78f55d662', {
            //     cluster: 'ap2',
            //     debug: true
            // });
            // const channel = pusher.subscribe('Test-channel');
            // channel.bind('Test-event', () => {
            //     this.$store.dispatch(callApi);
            //     console.log('connected')
            // });
        },
        connectDetail(callApi, data) {
            console.log(callApi, data)
            // const pusher = new Pusher('ba095b8c30f78f55d662', {
            //     cluster: 'ap2',
            //     debug: true
            // });
            // const channel = pusher.subscribe('Test-channel');
            // channel.bind('Test-event', () => {
            //     this.$store.dispatch(callApi, data);
            //     console.log('connected')
            // });
        },

    }
}
export default pusherApi