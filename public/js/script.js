function post(url, callback){
	var xhr = new XMLHttpRequest()
	xhr.open('POST', url, true) 
	xhr.onload = function(){ 
		if(xhr.status === 200){ 
			callback() 
		}else{ 
			callback('Error: ' + xhr.status) 
		} 
	} 

	xhr.send() 
}

function remove(url, callback){
	var xhr = new XMLHttpRequest()
	xhr.open('DELETE', url, true) 
	xhr.onload = function(){ 
		if(xhr.status === 200){ 
			callback() 
		}else{ 
			callback('Error: ' + xhr.status) 
		} 
	} 

	xhr.send() 
}

document.addEventListener('DOMContentLoaded', function(){
	[].forEach.call(document.querySelectorAll('a.delete'), function(node){
		node.addEventListener('click', function(event){
			event.preventDefault()
			
			if(confirm('Are your sure you want to remove "' + this.getAttribute('data-carname') + '"?')){
				remove(this.href, function(error){
					if(error){
						alert(error)
					}else{
						document.location = '/car'
					}
				})
			}
		}, false)
	});

	[].forEach.call(document.querySelectorAll('a[data-method="post"]'), function(node){
		console.log('POST NODE:: ', node)
		node.addEventListener('click', function(event){
			event.preventDefault()
			
			post(this.href, function(error){
				if(error){
					alert(error)
				}else{
					document.location = '/car'
				}
			})
		}, false)
	})
})

