let ar_leagues, br_leagues, cl_leagues, co_leagues, pe_leagues = [];

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
    constructor(pais, equipo1, equipo2, resultado, factor){
        this.pais = pais;
        this.equipo1 = equipo1;
        this.equipo2 = equipo2;
        this.resultado = resultado;
        this.factor = factor;
    }

}
 
 const loadCountries = ()=> {
    //Cargar Paises del acordeon
    let countries = new Array;
    countries = getCountries();


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

 const getCountries = () => {
    let countries = [];
    countries = JSON.parse(country_data);

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

 const renderByCountry = (country) =>{

    limpiarCore();

    let teams = getTeams(country.country)
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

 const modalSetup = (filter) => {
    const arrFilter = filter.split("-");
    const teams = getTeams(arrFilter[0]);
    const teams_filter = teams.filter(item => item.idTeam === arrFilter[1])

    const team = teams_filter[0]
    document.getElementById("exampleModalLabel").innerHTML = team.strTeam
    document.getElementById("modalBody").innerHTML = team.strDescriptionEN
 }

 const getLeagues = (country) =>{
    let leagues = [];
    switch(country){
        case "Argentina": {
            leagues = JSON.parse(ar_data_leagues);
            leagues.sort((a,b) => {
                return a.intDivision - b.intDivision;
            });
            break;
        }
        case "Brasil" : {
            leagues = JSON.parse(br_data_leagues);
            leagues.sort((a,b) => {
                return a.intDivision - b.intDivision;
            });
            break;
        }
        case "Chile" :{
            leagues = JSON.parse(cl_data_leagues);
            leagues.sort((a,b) => {
                return a.intDivision - b.intDivision;
            });
            break;
        }
        case "Colombia" :{
            leagues = JSON.parse(co_data_leagues);
            leagues.sort((a,b) => {
                return a.intDivision - b.intDivision;
            });break;
        }
        case "Perú" :{
            leagues = JSON.parse(pe_data_leagues);
            leagues.sort((a,b) => {
                return a.intDivision - b.intDivision;
            });
            break;
        }

    }
    return leagues;
 }

 const getTeams = (country) =>{
    let teams = [];
    switch(country){
        case "Argentina": {
            teams = JSON.parse(ar_data_teams);
            break;
        }
        case "Brasil" : {
            teams = JSON.parse(br_data_teams);
            break;
        }
        case "Chile" :{
            teams = JSON.parse(cl_data_teams);
            break;
        }
        case "Colombia" :{
            teams = JSON.parse(co_data_teams);
            break;
        }
        case "Perú" :{
            teams = JSON.parse(pe_data_teams);
            break;
        }

    }
    return teams;
 }

 const loadLeagues = (country)=> {
    const leagues = getLeagues(country);
    
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

const loadDetails = (idLeague, country) => {
    limpiarCore();
    
    const teams = getTeams(country);
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

    

    for (let i = 1; i <= equipos; i = i+2 ){
        const divRow = document.createElement("div");


        const match = `${country}-${arrTeams[i].id}-${arrTeams[i+1].id}`

        divRow.className ="apuesta match"
        // divRow.addEventListener("click", ()=> matchSelection(match));

        const factorPromedio = (arrTeams[i].factor + arrTeams[i+1].factor) / 2
        
        divRow.innerHTML = `<div class="equipo1">
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

const matchSelection = (match) => {
    console.log(match)
    const arrMatch = match.split("-");
    console.log(arrMatch);
    const factor1 = Math.random() * 10
    console.log(factor1)

    const country = arrMatch[0]
    const team1 = arrMatch[1]
    const team2 = arrMatch[2]
    const selection = arrMatch[3]
    const factor = arrMatch[4]
    

    /*Agregar datos al storage*/
    const bet = new Apuesta(country, team1, team2, selection, factor)
    let repetido = false

    if (localStorage.length > 0) {
        const bets = localStorage.getItem("bets")
        const arrLS = JSON.parse(bets);
        
        arrLS.forEach(lsItem => {
            if (bet.pais === lsItem.pais 
                && bet.equipo1 === lsItem.equipo1 
                && bet.equipo2 === lsItem.equipo2 
                )
                repetido = true
        })

        if (!repetido) {
            arrLS.push(bet);
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


const renderBets = () => {

    limpiarBets();

    let arrLS = new Array()
    arrLS = JSON.parse(localStorage.getItem("bets"));

    arrLS?.forEach(bet => {
        const country = bet.pais
        const selection = bet.resultado
        const arrTeams = getTeams(country)
         
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
        divApuesta.className = "apuesta"
        divApuesta.innerHTML = `<div class="equipo1">
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
                        <div class="monto">
                            <div class="custom-input">
                            <input type="number" class="form-control" id="${montoId}" placeholder="10000">
                            <button type="button" onclick='confirmarMonto("${montoId}")'>Confirmar</button>
                        </div>
                        </div>
                        </div>
                        `
        apuesta.appendChild(divApuesta);

    })
    //renderDetalleApuestas();
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
    <p class="card-text">Pendiente de mejoras.</p>
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
