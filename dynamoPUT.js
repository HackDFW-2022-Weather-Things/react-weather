
    // PUT request using fetch with async/await
    async function updatePost() {
        var params = {
            TableName: 'express-app',
            Item:{
                'id': {S: 'loc5'},
                'severity': {S: 'severe'},
                'name': {S: 'eric'}
            }
        };
        const response = await fetch(EXECUTEURLHERE, params);

        const data = await response.json();
        console.log(data);
    }


    async function getPost() {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        };
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/1', requestOptions);
        const data = await response.json();
        console.log(data.stringify);
    }

    updatePost();
 //getPost();
