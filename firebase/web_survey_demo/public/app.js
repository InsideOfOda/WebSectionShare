import analyzer from './analyzer.js'
import guide from './guide.js'

new Vue({
	el: '#app',
	data:{
		state: 'analyzer',
		language: 'eng'
	},
	components:{
		analyzer,
		guide
	}
})

