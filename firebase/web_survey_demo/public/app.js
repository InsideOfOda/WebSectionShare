import audience from './audience.js'
import guide from './guide.js'

new Vue({
	el: '#app',
	data:{
		state: 'audience',
		language: 'eng'
	},
	components:{
		audience,
		guide
	}
})

