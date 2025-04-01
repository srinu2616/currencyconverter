
const countryList = {
    AUD: "AU",
    BGN: "BG",
    BRL: "BR",
    CAD: "CA",
    CHF: "CH",
    CNY: "CN",
    CZK: "CZ",
    DKK: "DK",
    EUR: "EU",
    GBP: "GB",
    HKD: "HK",
    HRK: "HR",
    HUF: "HU",
    IDR: "ID",
    ILS: "IL",
    INR: "IN",
    ISK: "IS",
    JPY: "JP",
    KRW: "KR",
    MXN: "MX",
    MYR: "MY",
    NOK: "NO",
    NZD: "NZ",
    PHP: "PH",
    PLN: "PL",
    RON: "RO",
    RUB: "RU",
    SEK: "SE",
    SGD: "SG",
    THB: "TH",
    TRY: "TR",
    USD: "US",
    ZAR: "ZA"
};


  const BASE_URL = "https://api.frankfurter.app/latest";

  const dropdowns = document.querySelectorAll(".dropdown select");
  const btn = document.querySelector("form button");
  const fromCurr = document.querySelector(".from select");
  const toCurr = document.querySelector(".to select");
  const msg = document.querySelector(".msg");
  const amountInput = document.querySelector(".amount input");
  
  // Populate dropdowns with currency options
  for (let select of dropdowns) {
      for (let currCode in countryList) {
          let newOption = document.createElement("option");
          newOption.innerText = currCode;
          newOption.value = currCode;
          if (select.name === "from" && currCode === "USD") {
              newOption.selected = "selected";
          } else if (select.name === "to" && currCode === "INR") {
              newOption.selected = "selected";
          }
          select.append(newOption);
      }
  
      select.addEventListener("change", (evt) => {
          updateFlag(evt.target);
      });
  }
  
  // Update flag image when currency changes
  function updateFlag(element) {
      let currCode = element.value;
      let countryCode = countryList[currCode];
      let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
      let img = element.parentElement.querySelector("img");
      img.src = newSrc;
  }
  
  // Handle conversion when button is clicked
  btn.addEventListener("click", async (evt) => {
      evt.preventDefault();
      let amount = parseFloat(amountInput.value);
      
      if (isNaN(amount)) {
          amount = 1;
          amountInput.value = "1";
      } else if (amount < 1) {
          amount = 1;
          amountInput.value = "1";
      }
  
      try {
          msg.innerText = "Fetching exchange rates...";
          
          const fromCurrency = fromCurr.value;
          const toCurrency = toCurr.value;
          
          if (fromCurrency === toCurrency) {
              msg.innerText = `${amount} ${fromCurrency} = ${amount} ${toCurrency}`;
              return;
          }
          
          // Using Frankfurter API
          const response = await fetch(`${BASE_URL}?from=${fromCurrency}&to=${toCurrency}`);
          const data = await response.json();
          
          if (!data.rates || !data.rates[toCurrency]) {
              throw new Error("Could not fetch exchange rates");
          }
          
          const rate = data.rates[toCurrency];
          const finalAmount = (amount * rate).toFixed(2);
          
          msg.innerHTML = `<strong>${amount} ${fromCurrency} = ${finalAmount} ${toCurrency}</strong>`;
      } catch (error) {
          console.error("Conversion error:", error);
          msg.innerHTML = `<strong style="color: red;">Error: ${error.message}</strong>`;
      }
  });
  
  // Initialize flags on page load
  updateFlag(fromCurr);
  updateFlag(toCurr);