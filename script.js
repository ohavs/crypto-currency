(function () {
        let checkerSet = new Set();
        let moreInfoAboutCoins = new Map();
        let coinsArray;
        (function () {
            let url = 'https://api.coingecko.com/api/v3/coins';
            $.get(url)
                .then(function (coins) {
                    coinsArray = coins;
                    getCoins(coins);
                })
        })()


        //// get coins
        function getCoins(coins) {
            $(".main").empty();
            for (let coin of coins) {
                let coinName = coin.name;
                let coinId = coin.id;
                let symbol = coin.symbol;
                let coinImg = coin.image.large;
                let currencyUSD = coin.market_data.current_price.usd;
                let currencyILS = coin.market_data.current_price.ils;
                let currencyEUR = coin.market_data.current_price.eur;


                let check = `<input type="checkbox" unchecked value="${symbol}" class="checkbox" id="checkbox${symbol}" >`
                let checkboxes = $(".checkbox");

                let cardDiv = $(`<div class="card">
            <img src="${coinImg}" class="img">
            <h2 class="colored" id="h2">${coinName}</h2> 
            <p class="p"> ID: ${coinId}</p>
            <p class="symbol" id="symbol"> Symbol: ${symbol}</p>
            <p  class="currency display">USD : ${currencyUSD} $ </p>
            <p  class="currency display">ILS : ${currencyILS} ₪ </p>
            <p  class="currency display">EUR : ${currencyEUR} € </p>
            </div>`);

                $(check).prependTo(cardDiv);
                $(cardDiv).appendTo(".main");

                $(cardDiv).find("img").click(function (event) {
                    // getInfoAboutCoins(coinId);
                    $(cardDiv).find(".p").toggle();
                    $(cardDiv).find(".symbol").toggle();
                    $(cardDiv).find("h2").toggle();
                    $(cardDiv).find(".symbol").toggleClass("colored");
                    $(cardDiv).find(".currency").toggleClass("display");
                });
            }
            checkCoins(coins);
        }



        ////חיפוש לפי מטבע
        $("#searchValue").keyup(function () {
            let coinSearchValue = $("#searchValue").val();
            filterCoins(coinSearchValue);
            if ($("#searchValue").val()) {
                $(".bannerImg").hide();
            } else if ($("#searchValue").val() == "") {
                $(".bannerImg").show();
            }
        })



        ////פילטור מטבעות
        function filterCoins(coinSearchValue) {
            if (coinSearchValue == "") {
                getCoins(coinsArray);
                return;
            }
            let filteredCoins = coinsArray.filter(function (coin) {
                let filterId = coin.name.toLowerCase().includes(coinSearchValue);
                return filterId;
            })
            getCoins(filteredCoins);
        }


        //// back to top button
       
 
            $(window).scroll(function(){
           
       
             if ( $(this).scrollTop() > 200 ) { 
              $('.top').removeClass('display');
             } else { 
              $('.top').addClass('display');
             }
            });
            
            //Click event to scroll to top
            $('.top').click(function(){
             $('html, body').animate({scrollTop : 0},800);
             return false;
            });
            
          







        ////checkbox
        function checkCoins(coins) { 
            
            let checkboxes = $(".checkbox");
            checkboxes.change(function () {
                 if($(this).prop("checked")==true){
                     checkerSet.add(this.value);
                   
                 }
                 else if($(this).prop("checked")==false){
                    checkerSet.delete(this.value);    
                 }
                
                 console.log(checkerSet);
                
                 if(checkerSet.size==5){
                    getCurrencyData(checkerSet)
                  
                $("#reports").click(function(){
                    // window.location.replace('/reports.html')
                    $(".chart").toggleClass("display")
                    $(".bannerImg").toggleClass("display")
                })
         
                 }

                else if(checkerSet.size>5){
                    
                    $(".modal-coins").empty();
                    $(".modal-coins").append(`<p class="modalP">You can only select up to 5 coins. <br>
                    Replace selected coins if you wish: </p>
                    </p>`)
                    $("#modal").removeClass("display"); 
                    $(".close").click(function(){ 
                    $("#modal").addClass("display"); 
                })
                
                                checkerSet.forEach((checkedCoin)=>
                                modalToggle(checkedCoin,coins)    )}
                  
                })
              
            }

            //modal
            function modalToggle(checkedCoin,coins) {
                $(".modal-coins").append(
                    `<p class="modal-info">${checkedCoin}
                    <input type="checkbox" checked  class="checkbox float" id="checkbox-${checkedCoin}">           
                    </p>`)
                        $(`#checkbox-${checkedCoin}`).change(function () {
                        if($(this).prop("checked")==false){
                            checkerSet.delete(checkedCoin)
                            console.log(checkerSet);
                            console.log("unchecked");
                        $(`#checkbox${checkedCoin}`).prop("checked",false);
                        }
                        else if($(this).prop("checked")==true){
                            checkerSet.add(checkedCoin)
                            console.log(checkerSet);
                            console.log("checked");
                            $(`#checkbox${checkedCoin}`).prop("checked",true);
                        }

                    })
            }



            //loader
            $(window).on("load", function () {
                $(".loader-wrapper").fadeOut("slow");
            });

            ///dark mode
            $(".darkmode").click(function () {
                $("#body").toggleClass("lightMode");
                $(".h1").toggleClass("lightMode");
                $(".h2").toggleClass("lightMode");
                $("#nav").toggleClass("lightMode");
                $(".card").toggleClass("cardLightMode");
                $("#searchValue").toggleClass("cardLightMode");

            })

//////////////////////////////////////////////////////////////////////////////////////

function coinsCurrencyChart(currencyArr,currencyUrl){


const labels = [
    'USD',
    'EUR',
    'ILS',
  ];

  const data = {
    labels: currencyArr,
    datasets: [{
      label: 'Crypto Coins Currency',
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      data: [currencyUrl],
    }]
  };

  const config = {
    type: 'line',
    data: data,
    options: {}
  };
  
  const myChart = new Chart(
    document.getElementById('myChart'),config);
    

  
  }
 
 
 
function getCurrencyData(checkerSet) {
   
    const currencyArr=[];
    const [first]=checkerSet;
    currencyArr.push(first);
    const [,second]=checkerSet;
    currencyArr.push(second);
    const [,,third]=checkerSet;
    currencyArr.push(third);
    const [,,,forth]=checkerSet;
    currencyArr.push(forth);
    const [,,,,fifth]=checkerSet;
    currencyArr.push(fifth);
    localStorage.setItem('coinsCurrency', JSON.stringify(currencyArr))
    
    const currencyUrl = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${currencyArr}&tsyms=USD`;
    $.get(currencyUrl)
        .then(function (currency) {
            console.log(currency);
        
           
            coinsCurrencyChart(currencyArr,currencyUrl)
        })
        
}


//////////////////////////////////////////////////////////
    //// save to map
            // function getInfoAboutCoins(coinId){
            //     let url=`https://api.coingecko.com/api/v3/coins/${coinId}`;
            //    let coinsCurrency={};
            //    $.ajax({url, async:false, dataType:"json",success:function(data){
            //      coinsCurrency.usdCurrency=data.market_data.current_price.usd;
            //      coinsCurrency.eurCurrency=data.market_data.current_price.eur;
            //      coinsCurrency.ilsCurrency=data.market_data.current_price.ils;
            //      console.log(coinsCurrency);
            //      moreInfoAboutCoins.set(`${coinId}`,coinsCurrency);
            //      console.log(moreInfoAboutCoins);
            //    }})
            //  }

////////////////////////////////////////////////////////////

        })()