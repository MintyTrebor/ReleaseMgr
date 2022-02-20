import axios from 'axios';

export default {
    methods: {
        async getByGitAPI(apiURLSuffix, gitUName, gitRepoName){
			//use the gthub api to retrieve json data
			//apiURL suffix should be "releases/latest" for example
            //returns null for anything other than success unless connection error
			if(apiURLSuffix && gitUName && gitRepoName){
				const retJson = await axios.get(`https://api.github.com/repos/${gitUName}/${gitRepoName}/${apiURLSuffix}`)
				.then(res => res.data)
				.catch(function(error){
					console.warn("Git Raw File error : " + error);
					return {error: " getByGitAPI xhr error"};
				})
				const apiJson = await retJson
				if(apiJson.message) {
                    console.warn("GIT API error : " + apiJson.message);
                    return null;
				}else{
					return apiJson;
				}
			}else{
                console.warn("Required Values not Provided to use git API");
                return null;
			}
		},

		async getByGitWikiRaw(wikiFileName, gitUName, gitRepoName){
			//use the raw file access feature of github to download wiki md files
			//this method will not trigger CORS errors in the browser
			//wikiFileName should normally be "filename.md" for example and may also include a path prefix - files will be returned as raw text.
            //returns null for anything other than success unless connection error			
			if(wikiFileName && gitUName && gitRepoName){
				const retJson = await axios.get(`https://raw.githubusercontent.com/wiki/${gitUName}/${gitRepoName}/${wikiFileName}`)
				.then(res => res.data)
				.catch(function(error){
					console.warn("Git Raw File error : " + error);
					return {error: " getByGitWikiRaw xhr error"};
				})
				const fileData = await retJson;
				if(fileData.message) {
					console.warn("Git Raw Wiki error : " + fileData.message);
                    return null;
				}
                return fileData;
			}else{
				console.warn("Git Raw Wiki Required Values not Provided");
                return null;
			}
			
		},

		async getByGitFileRaw(filePathName, gitUName, gitRepoName){
			//use the raw file access feature of github to download repo files
			//this method will not trigger CORS errors in the browser
			//filePathName should be repo path + filename eg "main/src/POC/readme.md" - files will be returned as raw text.
            //returns null for anything other than success unless connection error
            //DO NOT USE THIS FOR ANYTHING OTHER THAN PLAIN TEXT FILES
			if(filePathName && gitUName && gitRepoName){
				const retJson = await axios.get(`https://raw.githubusercontent.com/${gitUName}/${gitRepoName}/${filePathName}`)
				.then(res => res.data)
				.catch(function(error){
					console.warn("Git Raw File error : " + error);
					return {error: " getByGitFileRaw xhr error"};
				})
				const fileData = await retJson;
				if(fileData.message) {
					console.warn("Git Raw File error : " + fileData.message);
                    return null;
				}
                return fileData;
			}else{
				console.warn("GIT Raw File Required Values not Provided");
                return null;
            }
		},
    }
}