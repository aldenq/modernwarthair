UI_DEFAULT_CONTEXTMENU_CLASS = "uk-padding-small"
UI_DEFAULT_CONTEXTFLOW_CLASS = "uk-padding-small uk-position-absolute"
UI_DEFAULT_UL_CLASS = "uk-nav"
UI_DEFAULT_LI_CLASS = "uk-margin"
UI_DEFAULT_BUTTON_CLASS = "uk-button uk-button-primary uk-width-1-1"
UI_DEFAULT_TOOLTIP_OPTIONS = ";pos:right;"




var globalContextBodyReference = document.getElementById("contextbody");
var globalGeneralOffcanvas = document.getElementById("globalGeneralOffcanvas");


var globalGeneralOffcanvasBody = document.getElementById("globalGeneralOffcanvasOuter");
var emptyNode = document.createElement('div')
globalGeneralOffcanvasBody.appendChild(emptyNode);

var oldBody = emptyNode;


class ContextMenu{

    constructor(){



        this.element = document.createElement("div");
        this.element.setAttribute("hidden", "");
        this.element.classList.add(UI_DEFAULT_CONTEXTMENU_CLASS);
        
        this.content = document.createElement('ul');
        this.content.classList.add(UI_DEFAULT_UL_CLASS);

        this.element.appendChild(this.content);
        globalContextBodyReference.appendChild(this.element);

        this.chunkList = new Array();

    }

    get raw(){
        return this.element;
    }


    pushRawElement(element) {
        this.content.appendChild(element);
    }

    pushElement(subelement) {

        var li = document.createElement('li');
        li.classList.add(UI_DEFAULT_LI_CLASS);
        li.appendChild(subelement);
        this.pushRawElement(li);
        return li;
    }

    pushButton(text, callback = undefined, tooltip=undefined, badgetext=undefined) {

        var button = document.createElement('button');
        var textNode = document.createTextNode(text);
        button.appendChild(textNode);
        button.className = UI_DEFAULT_BUTTON_CLASS;
        UIkit.update(button);
        if (callback != undefined){
            button.onclick = callback;
        }
        if (tooltip != undefined){
            button.setAttribute("uk-tooltip", "title: "+tooltip+UI_DEFAULT_TOOLTIP_OPTIONS);
        }
        
        var licontainer = this.pushElement(button);
        if (badgetext != undefined){
            var badge = document.createElement("span");
            var badgeNode = document.createTextNode(badgetext);
            badge.appendChild(badgeNode);
            badge.className = "uk-badge";
            button.appendChild(badge);
        }
        this.chunkList.push(licontainer)
        return button;

    }

    pushTitle(title, body = undefined){

        var header = document.createElement("div");
        var titleElement = document.createElement("h3");
        var titleText = document.createTextNode(title);
        titleElement.appendChild(titleText);
        titleElement.className = "uk-text-bold uk-text-center"
        header.appendChild(titleElement);
        var hr = document.createElement("hr");
        header.append(
            hr
        );

        this.pushRawElement(header);

        return header;
    }


    pushSwapper(pagelist, pagetitles){

        var navbar = document.createElement("ul");
        navbar.className = "uk-subnav uk-subnav-pill";
        var pages = document.createElement('ul');
        pages.className = "uk-switcher uk-margin";
        for (let i = 0;i<pagelist.length;i++){
            
            let element = pagelist[i];
            let title = pagetitles[i];
            element.removeAttribute("hidden");
            let li = document.createElement('li');
            let li_a = document.createElement('a');
            li_a.innerHTML = title;
            li.appendChild(li_a);
            navbar.appendChild(li);
            
            let li2 = document.createElement('li');
            li2.id = Math.random()*100000;
            li_a.href = "#"+li2.id;
            li2.appendChild(element);
            pages.appendChild(li2);
            
        }
        
        
        console.log(navbar);
        this.pushRawElement(navbar);
        this.pushRawElement(pages);

    }



    beginRender(){

        if (oldBody != this.element){
            // Delete old element
            globalGeneralOffcanvasBody.removeChild(oldBody);
            //oldBody.setAttribute("hidden");
            // Add new element
            globalGeneralOffcanvasBody.appendChild(this.element);
            // Show new element
            this.element.removeAttribute("hidden");
            // Setup for next time
            oldBody = this.element;
        }
        // Toggle
        UIkit.offcanvas('#'+globalGeneralOffcanvas.id).show();



    }


    delete(){
        this.element = undefined;
        this.content = undefined;
        this.chunkList = undefined;
    }

}

var test = new ContextMenu();
test.pushButton("A Button!");
var test2 = new ContextMenu();
test2.pushButton("Another Button!");

var bigtest = new ContextMenu();
bigtest.pushTitle("Title");
pages = [test.raw, test2.raw];
bigtest.pushSwapper(pages, ["Page 1", "Page 2"]);
bigtest.beginRender();