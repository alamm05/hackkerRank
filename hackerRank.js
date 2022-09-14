const puppeteer = require("puppeteer");
let {email,password} =require('./secrets');
// let email = "";
// let password = "";
let {answer} = require ('./codes');

let curTab;
let browserOpenPromise = puppeteer.launch({
    handless : false,
    defaultViewport :null,
    args :["--start-maximized"],
    // executablePath :"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
});
browserOpenPromise
.then(function(browser){
    console.log("browser is open");
    console.log(browserOpenPromise);
    console.log(browser);
    //an array of all open pages inside the browser
    //returns an array with all the pages in all browser contexts
    let allTabsPromise =browser.pages();
    return allTabsPromise;
})
.then(function(allTabsArr){
    let curTab = allTabsArr[0];
    console.log("new tab");
    //url to navigate page to
    let visitingLoginPagePromsise = curTab.goto("https://www.hackerrank.com/auth/login"
    );
    return visitingLoginPagePromsise;
})
.then(function(data){
// console.log(data);
console.log("opened hackerrank login page");
//selector(where to type), data(what to type)
let emailWillBeTypedPromise = curTab.type("input[name='username']", email,{delay:100});
return emailWillBeTypedPromise;
})
.then(function(){
    console.log("email is typed");
let passwordWillBeTypedPromise = curTab.type(
        "input[type='password']",
        password,{delay:100}
);
return passwordWillBeTypedPromise;

})
.then(function(){
    console.log("password has been typed");
    let willBeLoggedInPromise = curTab.click(".ui-btn.ui-btn-large.ui-btn-primary.auth-button.ui-btn-styled"
    );
    return willBeLoggedInPromise;
})
.then(function(){
    console.log("logged into hackkerrank successfully");
    // waitAndClick will wait for the selector to load and then click on the node
    let algorithmTabWillBeOpenedPromise = waitAndClick(
        "div[data-automation='algorithms']"
    );
    return algorithmTabWillBeOpenedPromise;
})
.then(function(){
    console.log("algorithm page is opened");
    let allQuesPromise = curTab.waitForSelector(
        'a[data-analytics="ChallengeListChallengeName"]'
    );
    return allQuesPromise;
})
.then(function(){
    function getAllQuesLinks(){
        let allElemArr =document.querySelectorAll('a[data-analytics="ChallengeListChallengeName"]'
        );
        let linksArr = [];
        for(let i = 0; i< allElemArr.length;i++){
            linksArr.push(allElemArr[i].getAttribute("href"));
        }
        return linksArr;
    }
    let linksArrPromise = curTab.evaluate(getAllQuesLinks);
    return linksArrPromise;
})
.then(function(linksArr){
    console.log("links to all ques recieved");
    // console.log(linksArr);
    // questions solve kerna h
    // link to the question to besolved idx of the linkArr
    let questioWillBeSolvedPromise = questionSolver(linksArr[0],0);
    for(let i = 1; linksArr.length;i++){
        questionWillBeSolvedPromise = questionWillBeSolvedPromise.then(function () {
            return questionSolver(linksArr[i], i);
          })
    }
    return questioWillBeSolvedPromise;
})
.then(function(){
    console.log("question is solved");
})
.catch(function(err){
    console.log(err);
});
function waitAndClick(algoBtn){
    let waitClickPromise = new promise(function(resolve,reject){
        let waitForSelectorPromise =curTab.waitForSelector(algoBtn);
        waitForSelectorPromise
        .then(function(){
            console.log("algo btn is found");
            let clickPromise =curTab.click(algoBtn);
            return clickPromise;
        })
        .then(function(){
            console.log("algo btn is clicked");
            resolve();
        })
        .catch(function(err){
            console.log(err);
        })
    });
    return waitClickPromise;
}
function questionSolver(url,idx){
    return new promise(function(resolve,reject){
        let fullLink = `https://www.hackerrank.com${url}`;
        let gotoQuesPagePromise = curTab.goto(fullLink);
        gotoQuesPagePromise
        .then(function(){
            console.log("question opened");
            // tick the custom input box mark
            let waitForCheckBoxAndClickPromise = waitAndClick(".checkbox-input");
            return waitForCheckBoxAndClickPromise;
        })
        .then(function(){
            // select the box where code will be typed 
            let waitForTextBoxPromise =curTab.waitForSelector(".custominput");
            return waitForTextBoxPromise;
        })
        .then(function(){
            let codeWillBetypedPromise =curTab.type(".custominput",answer[idx],{
                delay: 100,
            });
            return codeWillBetypedPromise;
            
        })
        .then(function(){
            // control key is pressed promise
            let controlPressedPromise = curTab.keyboard.down("Control");
            return controlPressedPromise;
        })
        .then(function(){
            let aKweyPressedPromise =curTab.keyboard.press("a");
            return aKweyPressedPromise;
        })
        .then(function(){
            let xKeyPressedPromise = curTab.keyboard.press("x");
            return xKeyPressedPromise;
        })
        .then(function(){
            let ctrlIsReleasePromise = curTab.keyboard.up("Control");
            return   ctrlIsReleasePromise;
        })
        .then(function(){
            // select the editor promise
            let cursorOnEditorPromise =curTab.click(".monaco-editor.no-user-select.vs"
            );
            return cursorOnEditorPromise;
        })
        .then(function(){
            // control key is pressed promise
            let controlPressedPromise =curTab.keyboard.down("Control");
            return controlPressedPromise;
        })
        .then(function(){
            let aKweyPressedPromise =curTab.keyboard.press("A");
            return aKweyPressedPromise;
        })
        .then(function(){
            let vKeyPressedPromise =curTab.keyboard.press("V");
            return vKeyPressedPromise;
        })
        .then(function(){
            let controlDownPromise = curTab.keyboard.up("Control");
            return controlDownPromise;
        })
        .then(function(){
            let submitButtonClickedPromise = curTab.click(".hr-monaco-submit");
            return submitButtonClickedPromise;
        })
        .then(function(){
            console.log("code submitted sucessfully");
            resolve();
        })
        .catch(function(err){
            reject(err);
        });   
    });
}
