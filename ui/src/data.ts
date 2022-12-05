export async function getPosts(){
	const response = await fetch(
		`/api/posts`, 
		{
		  headers: {
			"Content-Type": "application/json"
		  },
		  
		  method: "GET"
		}
	  )
	const data = await response.json()
	return [...data]	// Really?
	
}

export async function getPost(postId: string){
	const encodedpostId = encodeURIComponent(postId)
	const response = await fetch(
		`/api/post/${encodedpostId}`, 
		{
		  headers: {
			"Content-Type": "application/json"
		  },
		  
		  method: "GET"
		}
	  )
	const data = await response.json()
	return {...data}
}

export async function addList(name: string){
	const response = await fetch(
		`/api/list `, 
		{
		  headers: {
			"Content-Type": "application/json"
		  },
		  
		  method: "POST",

		  body: JSON.stringify(
			{name: name}
			)
		}
	  )
	const data = await response.json()
	return data
}






