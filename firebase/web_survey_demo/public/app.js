import audience from './audience.js'
import speaker from './speaker.js'

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

