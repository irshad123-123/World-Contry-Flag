let cl = console.log;

const countryContainer = document.getElementById('countryContainer')
const loader = document.getElementById('loader')
const arrow = document.getElementById('arrow')
const countryForm = document.getElementById('countryForm')
const searchFlagControl = document.getElementById('searchFlag')

const onFindCountry =(eve) =>{
    eve.preventDefault()

    let keyword = searchFlagControl.value.toLowerCase().trim()
    let country = document.querySelectorAll('#countryContainer .col-md-3')
    let found = false;

    country.forEach(con =>{
        let name = con.querySelector(".name h4").innerText.toLowerCase()
        let about = con.querySelector(".about").innerText.toLowerCase()
        let population = con.querySelector(".population").innerText.toLowerCase()

        if(name.includes(keyword) || about.includes(keyword) || population.includes(keyword)){
            con.style.display = ""   // show matched
            found = true
        } else {
            con.style.display = "none" // hide non-matched
            // searchFlagControl.style.display = "none"
        }
    })

    // Agar kuch bhi match nahi hua
    if(found){
         countryContainer.innerHTML += `<div class="col-12 text-center text-danger">
           <button class="position btn btn-danger" onclick="getAllCon()">Go Back</button>
        </div>`

    }else{
        countryContainer.innerHTML = `<div class="col-12 text-center text-danger">
           No result found <br><br>
           <button class="btn btn-danger" onclick="getAllCountry()">Go Back</button>
        </div>`

    }

    countryForm.reset()
    searchFlagControl.style.display = found ? "none" : ""

}

const getAllCon =() =>{
    getAllCountry()
    searchFlagControl.style.display = ""
}

countryForm.addEventListener('submit', onFindCountry)







const onUpside = (eve) =>{
    window.scrollTo({top:0, behavior:'smooth'})
}

arrow.addEventListener('click', onUpside)

let BASE_URL = `https://crud-35fc1-default-rtdb.asia-southeast1.firebasedatabase.app`
let COUNTRY_URL = `${BASE_URL}/country.json`

const objtoArr = (obj)=>{
    let countryArr = []
    for(const key in obj){
        obj[key].id = key
        countryArr.push(obj[key])
    }
    return countryArr
}

const CountryTemplating = (arr) =>{
    let result = ``;
    arr.forEach(obj =>{
        result += `<div class="col-md-3 mb-4">
                <div class="card p-1 m-0 h-100">
                    <div class="card-body p-1 m-0">
                        <div class="name">
                            <h4>${obj.name}</h4>
                        </div>
                        <figure>
                    <img src="${obj.flag}" , title="${obj.name}" , alt="${obj.name}">
                </figure>
                <strong>Population - </strong>
                <strong class="population">${obj.population}</strong>
                <div class="about">
                    ${obj.about}
                </div>
                    </div>
                </div>
            </div>`
    })
    countryContainer.innerHTML = result;
}

const makeApiCall = async(methodName, api_url, msgBody) =>{
    let msg = msgBody ? JSON.stringify(msgBody) : null;
    loader.classList.remove('d-none')
    try{
       let res =await fetch(api_url,{
            method:methodName,
            body: msg,
            headers :{
                "auth" : "JWT token form LS",
                "content-type" : "application/json"
            }
        })
        if(!res.ok){
            throw new Error('Newtork Error')
        }
        return res.json()
    }
    catch{
        cl('Error')
    }
    finally{
    loader.classList.add('d-none')

    }
}

const getAllCountry = async() =>{
   let res = await makeApiCall('GET', COUNTRY_URL, null)
   let posts = objtoArr(res)
   CountryTemplating(posts)
}

getAllCountry()