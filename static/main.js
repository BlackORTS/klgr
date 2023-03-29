
data_div = document.getElementById("data_div")

url = "http://"+location.host

async function callAPI (url) {
  let response = await fetch(url);
  let data = await response.json();

  return data
}

async function cicle(){
  while(1){
    id_list = await callAPI(url+"/get_id_list")
    console.log(id_list)
    connected = id_list.length
    create_elements(id_list)
    await sleep(1)
  }
}

function id_exist(id_list, id){
  for(let i = 0; i < id_list.length; i++){
    if(id_list[i] == id){
      return true;
    }
    return false;
  }
}

async function sleep(seconds){
  return new Promise(resolve => setTimeout(resolve, seconds + 1000))
}

function cleardata(id){
  callAPI(url+"/clear/"+id)
}

function create_elements(id_list){
  for(let i = 0; i < id_list.length; i++){
    if(document.getElementById(id_list[i])!=null) continue

    const new_element = document.createElement('p')
    new_element.setAttribute('id',id_list[i])

    const new_button = document.createElement('button')
    new_button.textContent = "REFRESH"
    new_button.setAttribute('id',id_list[i]+"_btn")

    new_button.onclick = function () {
      refresh_data(id_list[i])
    };

    const new_button_cl = document.createElement('button')
    new_button_cl.textContent = "CLEAR"
    new_button_cl.setAttribute('id',id_list[i]+"_btn_cl")

    new_button_cl.onclick = function () {
      cleardata(id_list[i])
      refresh_data(id_list[i])
    };

    /*document.querySelector("body").appendChild(new_element)
    document.querySelector("body").appendChild(new_button)*/
    data_div.appendChild(new_element)
    data_div.appendChild(new_button)
    data_div.appendChild(new_button_cl)

    refresh_data(id_list[i])
  }
}

async function refresh_data(id){
  const element = document.getElementById(id)
  data = await callAPI(url+"/data/"+id)
  element.textContent = data.data
}

let id_list = []
let connected = 0


cicle()
 