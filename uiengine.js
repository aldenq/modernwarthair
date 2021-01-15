UI_DEFAULT_CONTEXTMENU_CLASS = "uk-padding-small"
UI_DEFAULT_CONTEXTFLOW_CLASS = "uk-padding-small uk-position-absolute"
UI_DEFAULT_UL_CLASS = "uk-nav"
UI_DEFAULT_LI_CLASS = "uk-margin"
UI_COMPRESS_LI_CLASS = ""
UI_DEFAULT_BUTTON_CLASS = "uk-button uk-button-primary uk-width-1-1"
UI_DEFAULT_TITLE_CLASS =  "uk-text-bold uk-text-center uk-header uk-light"
UI_DEFAULT_PCLASS = 'uk-text uk-text-bolder uk-padding-remove uk-margin-remove uk-light'


UI_UPGRADE_AFFORDABLE = "uk-background-transparent uk-button uk-button-default uk-width-1-1"
UI_UPGRADE_DISABLED = "uk-button-danger uk-button uk-width-1-1 uk-animation-shake"
UI_UPGRADE_CARD_CLASS = "uk-card-body uk-padding-remove uk-margin-remove uk-animation-toggle"
UI_UPGRADE_CARD_CLASS_DISABLED = "uk-card-body uk-padding-remove uk-margin-remove uk-animation-toggle"

UI_DEFAULT_TOOLTIP_OPTIONS = ";pos:right;"

/**
 * globalContextBodyReference stores the 'contextbody' html element, where
 * most of the dynamic UI will be created.
 */
var globalContextBodyReference = document.getElementById("contextbody");
/**
 * globalGeneralOffcanvas stores the div containing the off-canvas used for
 * context menus.
 */
var globalGeneralOffcanvas = document.getElementById("globalGeneralOffcanvas");

/**
 * globalGeneralOffcanvasBody stores the main body div of the globalGeneralOffcanvas
 */
var globalGeneralOffcanvasBody = document.getElementById("globalGeneralOffcanvasOuter");
/**
 * An empty html div is used as the oldBody before context menus have been made.
 */
var emptyNode = document.createElement('div')
globalGeneralOffcanvasBody.appendChild(emptyNode);
/**
 * oldBody denotes the previous context menu, so that the next one
 * can remove it from the globalGeneralOffcanvas
 */
var oldBody = emptyNode;

/**
 * ContextMenu is used to create menus off to the side of the screen,
 * using a stack based design. As you push elements to the context menu,
 * they will be placed in the offcanvas in a list starting at the top
 * and moving down.
 */
class ContextMenu{

    /**
     * The ContextMenu constructor creates a base element for the menu,
     * a 'ul' element to store the main chunks of UI, and an array to store the
     * elements being pushed.
     */
    constructor(){


        // Create main element
        this.element = document.createElement("div");
        // Hide main element
        this.element.setAttribute("hidden", "");
        // Update class for default look
        this.element.classList.add(UI_DEFAULT_CONTEXTMENU_CLASS);
        
        // Create content element
        this.content = document.createElement('ul');
        // Update class for default look
        this.content.classList.add(UI_DEFAULT_UL_CLASS);

        // Add the new elements
        this.element.appendChild(this.content);
        globalContextBodyReference.appendChild(this.element);

        // Create array to store all the UIchunks pushed to the menu
        this.chunkList = new Array();

    }

    get raw(){
        return this.element;
    }

    /**
     * pushRawElement will just add any html element to the content
     * list for this context menu. 
     * @param {HTMLElement} element an element to add (in its raw form)
     * @returns None
     */
    pushRawElement(element) {
        this.content.appendChild(element);
    }

    /**
     * pushElement will create an 'li' tag to enclose the element provided,
     * in order to make it behave properly in the context menu.
     * @param {HTMLElement} subelement an element to be enclosed in an 'li', then added
     * @param {boolean}     compress when compress is true, the element will not be given padding.
     */
    pushElement(subelement, compress=false) {

        var li = document.createElement('li');
        if (compress){
            li.className = (UI_COMPRESS_LI_CLASS);
        }else{
            li.className = (UI_DEFAULT_LI_CLASS);
        }

        li.appendChild(subelement);
        this.pushRawElement(li);
        return li;
    }
    /**
     * pushButton will create a button element, and some other supporting elements
     * depending on the arguments. If an argument is left unused, that element
     * will not be created. Elements created will be automatically added to the context
     * menu.
     * 
     * @param {String} text text to display on the button
     * @param {function} callback function to call when button is clicked
     * @param {String} tooltip tooltip text to display on hover
     * @param {String} badgetext text to place on a badge
     * @returns {HTMLButtonElement} the button created
     */
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

    /**
     * pushTitle will create a title area for the context menu.
     * The title area includes an 'h' tag for your title text, and
     * and 'hr' below it.
     * @param {String} title Title text
     * @param {String} body some body text to place below the title
     * @returns {HTMLDivElement} the div container holding the title area
     */
    pushTitle(title, body = undefined){

        var header = document.createElement("div");
        var titleElement = document.createElement("h2");
        var titleText = document.createTextNode(title);
        titleElement.appendChild(titleText);
        titleElement.className = UI_DEFAULT_TITLE_CLASS
        header.appendChild(titleElement);
        var hr = document.createElement("hr");
        header.append(
            hr
        );

        this.pushRawElement(header);

        return header;
    }

    /**
     * pushSubtitle creates a title area similar to that created by
     * pushTitle, but with smaller text.
     * @see ContextMenu.pushTitle
     * @param {String} subtitle a subtitle to add ('h3')
     */
    pushSubtitle(subtitle){
        var header = document.createElement("div");
        var titleElement = document.createElement("h3");
        var titleText = document.createTextNode(subtitle);
        titleElement.appendChild(titleText);
        titleElement.className = UI_DEFAULT_TITLE_CLASS
        header.appendChild(titleElement);
        var hr = document.createElement("hr");
        header.append(
            hr
        );

        this.pushRawElement(header);

        return header;
    }

    /**
     * pushText will add a simple text element to the context menu in a 
     * 'p' tag. You don't need to escape any special html characters, it is
     * equipped to handle them with a textNode.
     * @param {String} text text to display
     * @returns {HTMLParagraphElement} the 'p' tag created
     */
    pushText(text){

        var ptag = document.createElement("p");
        var node = document.createTextNode(text);
        ptag.appendChild(node);
        ptag.className = UI_DEFAULT_PCLASS;
        this.pushElement(ptag, true);
        return ptag;

    }


    /**
     * show() will place the main element of this context menu on
     * the globalGeneralOffcanvas, and display the off-canvas.
     * @returns {HTMLDivElement} the context menu's main element
     */
    show(){

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
        return this.element;


    }

    /**
     * Help the garbage collector get rid of HTML elements when you're done with them.
     * Deleting a context menu will not actually destroy any elements, but the js garbage
     * collector will destroy them once nothing else is referencing them.
     */
    delete(){
        this.element = undefined;
        this.content = undefined;
        this.chunkList = undefined;
    }

    
}

/**
 * UnitMenu is an extension of the ContextMenu specifically for stats, upgrades, and special
 * abilities of individual units.
 */
class UnitMenu extends ContextMenu{

    /**
     * Construct a UnitMenu for a given Unit
     * @param {Unit} parent The unit to which this menu belongs
     */
    constructor(parent){
        super();
        this.parent = parent;
        this.pushTitle(/* parent.name*/ "Unit Name");
    }

    /**
     * display stats from a JSON object formatted like the following: 
     * {
     *      "stat-name": "stat-value",
     * }
     * @param {JSON} statlist stats to report 
     */
    pushStats(statlist){
        this.pushSubtitle("Stats");
        for (let stat in statlist){
            this.pushText(String(stat+": "+statlist[stat]))
        }
    }

    /**
     * Create an upgrade element based on parameters.
     * @param {String} name the name of the upgrade
     * @param {Integer} price the price of the upgrade
     * @param {Integer} progress the progress of the upgrade
     * @param {Boolean} affordable if the player could afford the upgrade
     */
    pushUpgrade(name, price, progress, affordable){
        
        // Create each DOM element that will be used
        let card = document.createElement("div");
        let button = document.createElement("button");
        let bottomdiv = document.createElement('ul');
        var pricetag = document.createElement("span");
        var tagwrapper = document.createElement("li");
        var pwrapper = document.createElement("li");
        let pbar = document.createElement("progress");

        // Add button Text
        button.appendChild(
            document.createTextNode(name)
        );

        // Some parts of the element will depend on weather or not the player
        // can afford the upgrade
        if (affordable){
            card.className = UI_UPGRADE_CARD_CLASS;
            button.className = UI_DEFAULT_BUTTON_CLASS;
            pricetag.className = "uk-label uk-label-success";
        }else{
            button.className = UI_UPGRADE_DISABLED;
            card.className = UI_UPGRADE_CARD_CLASS_DISABLED
            pricetag.className = "uk-label uk-label-danger";
        }

        // Fill in remaining elements
        card.appendChild(button);
        bottomdiv.className = "uk-navbar uk-margin";
        tagwrapper.appendChild(pricetag);
        pricetag.appendChild(
            document.createTextNode(price)
        );
        bottomdiv.appendChild( 
            tagwrapper
        );
        pwrapper.className = "uk-margin-left uk-inline"
        pwrapper.appendChild(pbar);
        pbar.className = "uk-progress";
        

        pbar.setAttribute("value", progress);
        pbar.setAttribute('max', '100');
        
        
        bottomdiv.appendChild(pwrapper);

        card.appendChild(bottomdiv);
        this.pushElement(card);
    }


}


// debugging:

let test =new UnitMenu(null);
test.pushStats({
    "Name": "Charlie",
    "Health": "100/100"
});
test.pushUpgrade("Test", "$25", 25, true);
test.pushUpgrade("Test2", "$250", 3, false);
test.pushButton("Press to test",function(){

    let test2 = new UnitMenu(null);
    test2.pushStats({
        "Name":"Bob",
        "Health":"26/100"
    });
    test2.show();

})
test.show();

function doTest(){
    let test = new ContextMenu();
    test.pushTitle("Temp");
    test.pushText("This is text.");
    test.pushButton("Button", function(){}, "tooltip");
    test.show();
}

/**
 * Info Needed:
 *  Stats
 *  Health bar
 *  Upgrades
 */

 /**
  * Extend class to be specialized for Unit Info / Upgrades
  *     Stats
  *     Upgrades
  *     Special Abilities
  *         -Progress bars 
  */

 /**
  * Unit Menu
  *     Appear below units onscreen
  *     contains moves
  */