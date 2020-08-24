import scaner from './scripts/scaner.js'
import qr_reader from './scripts/qr.js'

new Vue({
	el: '#app',
	data:{
		state: 'qr_reader'
	},
	components:{
		'scaner':scaner,
		'qr-reader':qr_reader
	}
})
