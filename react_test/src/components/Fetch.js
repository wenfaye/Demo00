import React,{useEffect,useState} from 'react'

export default function Fetch() {
    const [keyWord, setKeyWord] = useState('TheSims2');

    const fetchData = async ()=>{
        const url = `https://api.github.com/search/repositories?q=${keyWord}&sort=stars`
        try {
            let response = await fetch(url)
            let result = await response.json()
            const {name,html_url} = result.items[0]
            console.log(name,html_url)
            // this.setState({repoName:name,repoUrl:html_url,isLoading:false})
        } catch (error) {
            console.log(error);
            // this.setState({isLoading:false,err:error.message})
        }
    }

     useEffect( () => {
        fetchData();
    
      return () => {
        console.log('Fetch');
      }
    }, [])
    
  return (
    <div>Fetch</div>
  )
}
