import audience from '../components/audience.js'
import speaker from '../components/speaker.js'

new Vue({
	el: '#app',
	data:{
		state: 'audience',
	},
	components:{
		audience,
		speaker
	}
})

