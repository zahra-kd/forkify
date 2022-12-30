

const appendResults = (page, arr) => {
    $("#displayResult").empty();
    arr.recipes.slice((page - 1) * 10, page * 10).forEach((recipe) => {
        $(".lds-dual-ring").css("display", "none")
        $("#displayResult").append(`<div class="recipeResult" id="${recipe.recipe_id}">
        <img class="recipePicture" src="${recipe.image_url}"/>
        <div ="recipeInfo">
        <h5 class="recipeTitle">${recipe.title}</h5>
        <h6 class="recipePublisher">${recipe.publisher}</h6>
        </div>
        </div>`)
    })
    $('.recipeResult').click((event) =>{
        fetch(`https://forkify-api.herokuapp.com/api/get?rId=${event.currentTarget.id}`)
        .then((response)=>{
            if(response.ok) {
                $("#welcomeMsg").css("display", "none")
                return response.json()
            }
        }) 
        .then((result) =>{
            $("#recipe").css("display", "block")
            $(".recipeInfo").empty()
            $(".recipeInfo").append(`<img class="recipeImg" src="${result.recipe.image_url}" alt="recipe image"/>
            <h4 class="recipeName">${result.recipe.title}</h4>
            `)
            $(".recipeIngredient").empty()
            $(".recipeIngredient").append(`
            <h5 class="title">RECIPE INGREDIENTS</h5>
            <ul class="ingredientList">${result.recipe.ingredients.map((element)=> {
                return `<li class="ingredientElmt"><i class="fa-solid fa-check"></i>${element}</li>`}).join('')}
            </ul>`)
            $(".recipeDirection").append(`
            <h5 class="title">HOW TO COOK IT</h5>
            <p class="additionalInfo">This recipe was carefully designed and tested by <span class="publisher">${result.recipe.publisher}</span>. Please check out directions at their website.</p>
            
            `)
        })
    })
}

$("#prev").hide();
$("#next").hide();

$('#searchForm').submit((event) => {
    event.preventDefault();
    let value = $("#searchInput").val();
    $("aside").append('<div class="lds-dual-ring"></div>')

    fetch(`https://forkify-api.herokuapp.com/api/search?q=${value}`)
    .then((response) => {
        if (response.ok) {
            return response.json()
        } else {
            $(".lds-dual-ring").css("display", "none")
            $("aside").append(`<div class="errorMsg">
            <i class="fa-solid fa-triangle-exclamation">
            <p>No recipes found for your query! Please try again ;)</p>
            </div>`)
        }
    })
    .then((result) => {
        let pageNumber = Math.ceil(result.recipes.length/10)
        let currentPage = 1;
        $("#next").show();
        $("#next").text(currentPage + 1);
        appendResults(1, result);
        $("#prev").click(() => {
            currentPage--;
            $("#next").show();
            appendResults(currentPage, result);
            $("#prev").text(currentPage - 1);
            $("#next").text(currentPage + 1);
            if(currentPage == 1) {
                $("#prev").hide();
            }
        })
        $("#next").click(() => {
            currentPage++;
            $("#prev").show();
            appendResults(currentPage, result);
            $("#prev").text(currentPage - 1);
            $("#next").text(currentPage + 1);
            if(currentPage == pageNumber) {
                $("#next").hide();
            }
        })
    })
})
