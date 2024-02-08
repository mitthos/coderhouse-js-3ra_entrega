// let ar_leagues, br_leagues, cl_leagues, co_leagues, pe_leagues = [];

class Equipo {
    constructor(id, nombre, escudo) {
        this.id = id;
        this.nombre = nombre;
        this.escudo = escudo;
        this.factor = this.generarFactorNumerico();
    }

    generarFactorNumerico() {
        return Math.floor(Math.random() * 5) + 1;
    }
}

class Apuesta {
    constructor(pais, equipo1, equipo2, resultado, factor, id){
        this.pais = pais;
        this.equipo1 = equipo1;
        this.equipo2 = equipo2;
        this.resultado = resultado;
        this.factor = factor;
        this.id = id;
    }

}
 
 const loadCountries = async ()=> {
    //Cargar Paises del acordeon
    let countries = new Array;
    countries = await getCountries();


    const divAcordeon = document.getElementById("accordionLeague");
    
    countries.forEach(item => {
        const div = document.createElement("div");
        const btnName = "btn-" + item.country;
        // const leagues = loadLeagues(item.country);
        div.className = "accordion-header";
        div.innerHTML = `<h2 class="accordion-header">
                        <button class="accordion-button collapsed accordion-country" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${item.country}" aria-expanded="false" aria-controls="collapse${item.country}">
                            ${item.country}
                        </button>
                        </h2>
                        <div id="collapse${item.country}" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                        <div id="accordion-body-${item.country}" class="accordion-body-${item.country}">
                            
                        </div>
                    </div>`

        divAcordeon.appendChild(div);

        //loadLeagues
        loadLeagues(item.country);
    })

    const countriesMenu = document.getElementById("countriesMenu");
    countries.forEach(country => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.className = "dropdown-item"
        a.addEventListener("click", () => renderByCountry(country))
        a.innerHTML = country.country;
        li.appendChild(a);
        countriesMenu.appendChild(li);

    })

    const delBets = document.getElementById("deleteBet");
    const anchorDelete = document.createElement("a")
    anchorDelete.className = "nav-link colorText"
    anchorDelete.innerHTML = "Borrar Apuestas"
    anchorDelete.href = '#';
    anchorDelete.addEventListener("click",  deleteBets);
    delBets.appendChild(anchorDelete)
 }

 const getCountries = async () => {
    // let countries = [];
    // countries = JSON.parse(country_data);

    const response = await fetch("./js/data_leagues.json")
    countries = await response.json()


    return countries;
    
 }

 const limpiarCore = () => {
    const divcontenedor = document.getElementById("container-core");
    while (divcontenedor.lastElementChild) {
        divcontenedor.removeChild(divcontenedor.lastElementChild);
    }
 }

 const limpiarBets = () => {
    const divcontenedor = document.getElementById("bet-list");
    while (divcontenedor.lastElementChild ) {
        divcontenedor.removeChild(divcontenedor.lastElementChild);
        
    }
    renderDetalleApuestas();
 }

 const renderByCountry = async (country) =>{

    limpiarCore();

    let teams = await getTeams(country.country)
    const divcontenedor = document.getElementById("container-core");

    
    const divContainer = document.createElement("div")
    divContainer.className = "container mt-5"
    const divRow = document.createElement("div");
    divRow.className = "row justify-content-center card-container"
    teams.forEach(team => {
        
        const divCol = document.createElement("div");
        divCol.className = "col-md-4 mb-4"

        const cardBody = document.createElement("div")
        cardBody.className = ""
        const card = document.createElement("div")
        card.className = "card"
        card.innerHTML = `        
                <img src="${team.strTeamBadge}" class="card-img-top" alt="${team.strTeam}">
                <div class="card-body">
                  <h5 class="card-title">${team.strTeam}</h5>
                  <button id="modalTeam" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    Más Información...
                  </button>
                </div>

        `
        divCol.appendChild(card)
        divRow.appendChild(divCol)
        
        // document.getElementById("exampleModalLabel").innerHTML = team.strTeam
        // document.getElementById("modalBody").innerHTML = team.strDescriptionEN

        card.getElementsByClassName("btn")[0].addEventListener("click", ()=> modalSetup(country.country+"-"+team.idTeam));

       
    })
    divContainer.appendChild(divRow)
    divcontenedor.appendChild(divContainer);
    
 }

 const modalSetup = async (filter) => {
    const arrFilter = filter.split("-");
    const teams = await getTeams(arrFilter[0]);
    const teams_filter = teams.filter(item => item.idTeam === arrFilter[1])

    const team = teams_filter[0]
    document.getElementById("exampleModalLabel").innerHTML = team.strTeam
    document.getElementById("modalBody").innerHTML = team.strDescriptionEN
 }

 const getLeagues = async (country) =>{
    let leagues = [];
    let path_league = ""
    switch(country){
        case "Argentina": {
            // leagues = JSON.parse(ar_data_leagues);
            path_league = "./js/Leagues/Argentina/ar_data_leagues.json"
            break;
        }
        case "Brazil" : {
            path_league = "./js/Leagues/Brasil/br_data_leagues.json"
            break;
        }
        case "Chile" :{
            path_league = "./js/Leagues/Chile/cl_data_leagues.json"
            break;
        }
        case "Colombia" :{
            path_league = "./js/Leagues/Colombia/co_data_leagues.json"
            break;
        }
        case "Perú" :{
            path_league = "./js/Leagues/Peru/pe_data_leagues.json"
            break;
        }

    }

    const response = await fetch(path_league)
    leagues = await response.json()

    leagues.sort((a,b) => {
        return a.intDivision - b.intDivision;
    });

    return leagues;
 }

 const getTeams = async (country) =>{
    let teams = [];
    let path_team = ""
    switch(country){
        case "Argentina": {
            path_team = "./js/Leagues/Argentina/ar_data_teams.json"
            break;
        }
        case "Brazil" : {
            path_team = "./js/Leagues/Brasil/br_data_teams.json"
            break;
        }
        case "Chile" :{
            path_team = "./js/Leagues/Chile/cl_data_teams.json"
            break;
        }
        case "Colombia" :{
            path_team = "./js/Leagues/Colombia/co_data_teams.json"
            break;
        }
        case "Perú" :{
            path_team = "./js/Leagues/Peru/pe_data_teams.json"
            break;
        }

    }

    const response = await fetch(path_team)
    teams = await response.json()
    return teams;
 }

 const loadLeagues = async (country)=> {
    const leagues = await getLeagues(country);
    
    // return leagues;
    const divNode = document.getElementById("accordion-body-"+country);
    const buttons = document.createElement("div")

    buttons.className = "d-grid gap-2"
    leagues.forEach(league =>{
        

        const btn = document.createElement("button");
        btn.id ="btn-" + country;
        btn.innerHTML = league.strLeague;
        btn.className = "btn btn-outline-secondary btn-sm buttons-side"
        btn.addEventListener("click", ()=> loadDetails(league.idLeague, country))
        buttons.appendChild(btn)
    })
    divNode.appendChild(buttons);
 }

const loadPage = ()=> {
    loadCountries();
    renderBets();
    renderDetalleApuestas();
} 

const loadDetails = async (idLeague, country) => {
    limpiarCore();
    
    const teams = await getTeams(country);
    const teams_filter = teams.filter(item => item.idLeague === idLeague)

    const arrTeams = []
    teams_filter.forEach(team => {
        const team_info = new Equipo(team.idTeam, team.strTeam, team.strTeamBadge)
        arrTeams.push(team_info)
    })

    const teams_number = teams_filter.length;
    let equipos = 0;
    if (teams_number % 2 == 0){
        equipos = teams_number
    }else {
        equipos = Math.floor(teams_number / 2) * 2
    }
    
    console.log("equipos ", equipos);
    
    const divcontenedor = document.getElementById("container-core");

    

    for (let i = 0; i < equipos; i = i+2 ){
        const divRow = document.createElement("div");


        const match = `${country}-${arrTeams[i]?.id}-${arrTeams[i+1]?.id}`

        divRow.className ="apuesta match"
        // divRow.addEventListener("click", ()=> matchSelection(match));

        const factorPromedio = (arrTeams[i].factor + arrTeams[i+1].factor) / 2
        
        divRow.innerHTML = `<div class="equipos">
                                <div class="equipo1">
                                    <img src="${arrTeams[i].escudo}" alt="logo1">
                                    <span>${arrTeams[i].nombre}</span>
                                </div>
                                <div class="vs">
                                    <span>VS</span>
                                </div>
                                <div class="equipo2">
                                    <img src="${arrTeams[i+1].escudo}" alt="logo1">
                                    <span>${arrTeams[i+1].nombre}</span>
                                </div>
                            </div>
                            <div class = "factores">
                                <div class="btn btn-sm bg-secondary local">L: ${arrTeams[i].factor}</div>
                                <div class="btn btn-sm  bg-secondary empate">E: ${factorPromedio}</div>
                                <div class="btn btn-sm  bg-secondary visita">V: ${arrTeams[i+1].factor}</div>
                            </div>`
        
        divRow.getElementsByClassName('local')[0].addEventListener("click", ()=> matchSelection(match+"-L-"+arrTeams[i].factor));
        divRow.getElementsByClassName('empate')[0].addEventListener("click", ()=> matchSelection(match+"-E-"+factorPromedio));
        divRow.getElementsByClassName('visita')[0].addEventListener("click", ()=> matchSelection(match+"-V-"+arrTeams[i+1].factor));

        divcontenedor.appendChild(divRow)
    }
    
}

const getBetId = () => JSON.parse(localStorage.getItem('bets'))?JSON.parse(localStorage.getItem('bets')).length + 1:1;

const matchSelection = (match) => {
    console.log(match)
    const arrMatch = match.split("-");
    console.log(arrMatch);
    const factor1 = Math.random() * 10
    console.log(factor1)
    const id = getBetId();

    const country = arrMatch[0]
    const team1 = arrMatch[1]
    const team2 = arrMatch[2]
    const selection = arrMatch[3]
    const factor = arrMatch[4]
    

    /*Agregar datos al storage*/
    const bet = new Apuesta(country, team1, team2, selection, factor, id)
    let repetido = false

    if (localStorage.length > 0) {
        const bets = localStorage.getItem("bets")
        const arrLS = JSON.parse(bets);
        
        arrLS?.forEach(lsItem => {
            if (bet.pais === lsItem.pais 
                && bet.equipo1 === lsItem.equipo1 
                && bet.equipo2 === lsItem.equipo2 
                )
                repetido = true
        })

        if (!repetido) {
            arrLS?.push(bet);
            localStorage.removeItem(bets)
            localStorage.setItem('bets', JSON.stringify(arrLS))

            // apuesta.appendChild(divApuesta);
        }
        //renderDetalleApuestas();
        
    }else {
        const arrBet = []
        arrBet.push(bet)
        localStorage.setItem('bets', JSON.stringify(arrBet))
        //renderDetalleApuestas();
        // apuesta.appendChild(divApuesta);
    }
    
    renderBets()
    updateBetCount()

}

const validarMonto = (inputId) => {
    const apuesta = document.getElementById(inputId);
    const monto = parseInt(apuesta.value, 10);

    if (isNaN(monto) || monto <= 0 || apuesta.value.trim() === "") {
        apuesta.setCustomValidity('Por favor, ingrese solo números mayores a cero sin puntos ni comas');
        alert('Por favor, ingrese solo números mayores a cero sin puntos ni comas');
    } else {
        apuesta.setCustomValidity('');
        alert('Número está bien');
    }
};

const confirmarMonto = (id) => {
    var input = id;
    validarMonto(input);
}

const renderBets = async () => {

    limpiarBets();

    let arrLS = new Array()
    arrLS = JSON.parse(localStorage.getItem("bets"));
    if (arrLS === null) {
        arrLS = new Array()
    }

    for (bet of arrLS) 
    // arrLS?.forEach(bet => 
    {
        const country = bet.pais
        const selection = bet.resultado
        const arrTeams = await getTeams(country)
         
        const teamNode1 = arrTeams.filter(item => item.idTeam === bet.equipo1)
        const teamNode2 = arrTeams.filter(item => item.idTeam === bet.equipo2)

        let resultado = ''
        switch (selection){
            case 'L': {
                resultado = 'Local'
                break;
            }
            case 'E': {
                resultado = 'Empate'
                break;
            }
            case 'V': {
                resultado = 'Visita'
                break;
            }
        }

        let montoId = teamNode1[0].strTeam;

        // const apuesta = document.getElementsByClassName("cart")[0];
        const apuesta = document.getElementById("bet-list");
        const divApuesta = document.createElement("div");
        divApuesta.className = "apuesta";
        divApuesta.id = bet.id;
        divApuesta.innerHTML = `<div class="deleteIcon">
                                    <i class="bi bi-x-circle-fill deleteIcon"></i>
                                </div>
                                <div class="partido">
                                    <div class="equipo1">
                                        <img src="${teamNode1[0].strTeamBadge}" alt="logo1">
                                        <span>${teamNode1[0].strTeam}</span>
                                    </div>
                                    <div class="vs">
                                        <span>VS</span>
                                    </div>
                                    <div class="equipo2">
                                        <img src="${teamNode2[0].strTeamBadge}" alt="logo1">
                                        <span>${teamNode2[0].strTeam}</span>
                                    </div>
                                    <div class = "factores">
                                        <div class="badge bg-secondary local">${resultado}</div>
                                    </div>
                                </div>
                                <div class="monto">
                                    <div class="custom-input">
                                        <input type="number" class="form-control" id="${montoId}" placeholder="10000">
                                        <button type="button" onclick='confirmarMonto("${montoId}")'>Confirmar</button>
                                    </div>
                                </div>
                        `
        apuesta.appendChild(divApuesta);
        divApuesta.querySelector('.deleteIcon').addEventListener('click', function() {
            Swal.fire({
                title: '¿Desea eliminar la apuesta?',
                text: 'Presione "Eliminar apuesta" si está seguro.',
                icon: 'warning',
                iconColor: '#008170',
                showCancelButton: true,
                confirmButtonText: 'Eliminar apuesta',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#008170'
              }).then((result) => {
                if (result.isConfirmed) {
                    const bets = JSON.parse(localStorage.getItem('bets'));
                    const newBets = bets.filter(bet => String(bet.id) !== divApuesta.id);
                    localStorage.removeItem('bets');
                    localStorage.setItem('bets', JSON.stringify(newBets));
                    divApuesta.remove();
                    renderDetalleApuestas();
                } 
              })
        });

    }
    // )
    
}


const updateBetCount = () => {
    const countApuestas = document.getElementById('bet-list').childElementCount;
    document.getElementById('bet_count').innerHTML = countApuestas;
}

const renderDetalleApuestas = () => {
    const countApuestas = document.getElementById('bet-list').childElementCount;
    const detalle = document.getElementById("detalleApuestas");
    
    while (detalle.lastElementChild) {
        detalle.removeChild(detalle.lastElementChild);
    }

    const divDetalle = document.createElement("div");
    divDetalle.className = ""
    divDetalle.innerHTML = `<div class="card-body">
    <h5 class="card-title">Detalle de apuestas</h5>
    <h6 class="card-subtitle mb-2 text-body-secondary">Usted tiene <span id="bet_count">${countApuestas}</span> apuestas </h6>
    
  </div>`
    detalle.appendChild(divDetalle);
}

const deleteBets = () =>{
    localStorage.removeItem("bets");
    renderBets();
}

const toggleReadMore = (element) => {
    let content = element.parentNode.previousSibling.previousSibling;

    content.classList.toggle("read-more-show");

    if (content.classList.contains("read-more-show")) {
        element.textContent = "Leer menos";
    } else {
        element.textContent = "Leer más";
    }
}

loadPage();
