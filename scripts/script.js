/**
 *  @fileOverview   This file is injected to the coursebook web pages.
 *  @author         Sai Tanay Desaraju
 */

const table = ".section-list";
const tableHead = "table > thead > tr";
const tableBody = "table > tbody";
const tableBodyRows = "table > tbody > tr";
const showRMPTab = true;
const showUTDGradesTab = true;
const showRMPCol = true;
const showUTDGradesCol = true;
const expandedSectionHeight = 600;
const rmpIcon = "https://img.icons8.com/ios-glyphs/32/000000/external-link.png";
const utdgradesIcon = "https://img.icons8.com/material-sharp/24/000000/graph.png";
const utdgradesAvailableFor = ['17f', '18s', '18u', '18f', '19s'];

const tableJQ = $(table);
const tableHeadJQ = $(tableHead);
const tableBodyJQ = $(tableBody);
const tableBodyRowsJQ = $(tableBodyRows);
let classes = [];

(function(){
    if(tableJQ.length === 0) return;
    parseTable();
    addColumns();
    replaceOnClicks();
})();

/**
 * Parses the search results table and stores the values in the "classes" variable
 */
function parseTable(){
    $(tableBodyJQ).children().each(function(){
        let thisClass = [];
        let children = $(this).children();
        thisClass.push(children.eq(0).text().substring(0, 3));
        thisClass.push(children.eq(1).find('a').text());
        thisClass.push(children.eq(2).text(), children.eq(3).text());
        classes.push(thisClass);
    });
}

/**
 * Adds columns to the search results table.
 */
function addColumns(){

    if(showRMPCol)tableHeadJQ.append("<th style='width:40px' title='Search on RMP'>RMP</th>");
    if(showUTDGradesCol) tableHeadJQ.append("<th style='width:40px' title='More Info'>UTD Grades</th>");

    $(tableBodyJQ).children().each(function(index){

        if(showUTDGradesCol) {  // If showUTDGradesCol flag is enabled
            if (!classes[index][3].includes("-Staff-")) {   // If the professor is not staff
                // Add an rmpButton to the end of the row.
                $(this).append("<td><img class='rmpButton' src='" + rmpIcon + "' " +
                    "title='Search on RMP for " + classes[index][3] + "'" +
                    " style='display:block;margin:auto;width:22px;height:22px;cursor:pointer;' " +
                    +"</td>");

                // Add an onclick handler that opens the RMP search result.
                $(this).find(".rmpButton").on("click", function () {
                    window.open(getURL(index, "rmp"), "_blank");
                    return false;
                });
            } else {
                $(this).append("<td></td>");
            }
        }

        if(showRMPCol) { // If showRMPCol flag is enabled
            // Add a utdGrades button to the end of the row.
            $(this).append("<td><img class='utdgradesButton' src='" + utdgradesIcon + "' " +
                "title='Search on UTD grades for " + classes[index][3] + "'" +
                " style='display:block;margin:auto;width:22px;height:22px;cursor:pointer;'</td>");

            // Add an onclick handler to the button that opens the utdgrades search result.
            $(this).find(".utdgradesButton").on("click", function () {
                window.open(getURL(index, "utdgrades"), "_blank");
                return false;
            });
        }
    });
}

/** Returns the URL to load the web page.
 * If grade distributions are available for the requested term, data is loaded
 * for that particular class. Else, only class name (CS), number (1337), and
 * professor name (unless it's staff) are taken into consideration.
 *
 * @param {Number} index    index of the respective class in classes[] array.
 * @param {String} type     Name of the website to be loaded (either "rmp" or "utdgrades").
 * @returns {string|null}   The URL.
 */
function getURL(index, type) {
    switch (type) {
        case "rmp":
            return "https://www.ratemyprofessors.com/search.jsp?query=" + classes[index][3] + " UT Dallas";
        case "utdgrades":
            let url = "https://saitanayd.github.io/utd-grades/";
            let curClass = classes[index];
            let classNumSplit = curClass[1].split(' ');
            console.log(curClass);
            url += "?subj=" + classNumSplit[0];
            url += "&num=" + classNumSplit[1].split('.')[0];
            if(curClass[3] !== "-Staff-")url += "&prof=" + curClass[3];
            if(utdgradesAvailableFor.indexOf(curClass[0].toLowerCase()) !== -1){
                // Grade distributions are available for this term.
                url += "&sect=" + classNumSplit[1].split('.')[1];
                url += "&term=" + curClass[0].toLowerCase();
            }
            return url;
        default:
            return null;
    }
}

/**
 * Stock open_subrow function with callbacks of $(...).load set to 'addTabs' function.
 *
 * @Version         cb11 :: 6326b :: 2019-06-26 11:49:00
 * @Date_Retrieved  07/10/19
 * @link            https://d2jm41oajq77sf.cloudfront.net/js/alertify+tooltipster+ptools+cb11+ver-28
 */
function openSubRowModified(event, xparent_row_id, clip_type, data_id, toggle, subaction, row_class){
    var parent_row_id = $(event.currentTarget).closest("tr").attr("id");
    child_id = parent_row_id + "child";
    childcontent_id = parent_row_id + "childcontent";
    control_icon_id = parent_row_id + "-i";
    if (row_class == "expandedrow catbook") {
        if (clip_type == "last") {
            clip_type = last_clip_catbook
        } else {
            last_clip_catbook = clip_type
        }
    } else {
        if (clip_type == "last") {
            clip_type = last_clip_coursebook
        } else {
            last_clip_coursebook = clip_type
        }
    }
    if ($("#" + child_id).length === 0) {
        if (!event.shiftKey) {
            $("." + row_class).remove()
        }
        rows_in_parent = $("#" + parent_row_id).prop("cells").length;
        $("#" + parent_row_id).after('<tr id="' + child_id + '" class="' + row_class + '"><td colspan="' + rows_in_parent + '" id="' + childcontent_id + '"><p align="center"><img src="https://d2jm41oajq77sf.cloudfront.net/images/ajax-loader.gif" /></p></td></tr>');
        $("#" + childcontent_id).load("https://coursebook.utdallas.edu/clips/" + clip_type + ".zog", {
            id: data_id,
            div: childcontent_id,
            subaction: subaction,
            visit: "no robots allowed.",
            hi: "You agree that you will not use any robot, spider, scraper or other automated means to access this website for any purpose without our prior express written permission."
        }, function(){addTabs(childcontent_id);});
        var scrollto = $("#" + childcontent_id).offset().top;
        $("body,html,document").animate({
            scrollTop: scrollto
        }, 1e3)
    } else if (toggle) {
        $("#" + child_id).remove()
    } else {
        $("#" + childcontent_id).load("https://coursebook.utdallas.edu/clips/" + clip_type + ".zog", {
            id: data_id,
            div: childcontent_id,
            subaction: subaction,
            visit: "no robots allowed.",
            hi: "You agree that you will not use any robot, spider, scraper or other automated means to access this website for any purpose without our prior express written permission."
        }, function(){addTabs(childcontent_id);}).hide().fadeIn("slow")
    }
}

/**
 *  Replaces "open_subrow" function with openSubRowModified function in the
 *  onclick' handlers of the rows in the search results table.
 */
function replaceOnClicks(){
    // Loop through each row in the search results table
    tableBodyRowsJQ.each(function(){

        // Get and parse the arguments in the original open_subrow function
        // and store each of them into an array (org_func_parameters).
        let org_func_parameters = $(this).prop("onclick").toString();
        org_func_parameters = org_func_parameters.substring(org_func_parameters.indexOf("open_subrow(event,") + 18,
            org_func_parameters.lastIndexOf(')')).split(",").map(item => {
            item = item.trim();
            if(item.charAt(0) === '\'' && item.charAt(item.length - 1) === '\'')
                item = item.substring(1, item.length - 1);
            return item;
        });

        // Remove the original onclick handler
        $(this).prop("onclick", null).off("click");

        // Add the new onclick handler that calls the modified open_subrow function
        // (with the same arguments as before)
        $(this).on("click", (function(event){
            openSubRowModified(event,...org_func_parameters);
            return false;
        }));
    });
}

/**
 * Adds the new tabs to the tabs list.
 *
 * @param {String} childcontent_id      id of the expanded row
 */
function addTabs(childcontent_id){
    if(!showRMPTab && !showUTDGradesTab) return;
    let list = $('#' + childcontent_id + " > div > div.expandblock-tabs > ul");
    let content = $('#' + childcontent_id + " > div > div.expandblock-content");
    let index = parseInt(childcontent_id.substring(2, childcontent_id.indexOf("child"))) - 1;

    // Call this function to add the sections once again if any of the
    // other tabs are clicked (and the frame is reloaded)

    list.find('a').each(function(){
        let str = $(this).prop("onclick").toString();
        str = str.substring(str.indexOf(".load('") + 7, str.indexOf('}') + 1);
        let args = [str.substring(0, str.indexOf('\'')),
            JSON.parse(str.substring(str.indexOf('{')).replace(/'/g, '"'))];

        $(this).prop("onclick", null).off("click");
        $(this).prop("style", "cursor: pointer;");
        $(this).removeAttr("href");
        $(this).on("click", function () {
            $("#" + childcontent_id).load(args[0], args[1], function () {
                addTabs(childcontent_id);
            });
        })
    });

    // Append RMP Tab

    if(showRMPTab && !classes[index][3].includes("-Staff-")) {
        list.append("<li class=\"lev4-notactive\">" +
            "<a id=\"tab-extension-rmp\" style='cursor:pointer'>RMP</a></li>"
        );

        let rmpTab = $("#tab-extension-rmp").parent();

        rmpTab.on("click", function () {
            list.children().removeClass("lev4-active").addClass("lev4-notactive");
            rmpTab.removeClass("lev4-notactive").addClass("lev4-active");
            // noinspection CssInvalidPropertyValue
            content.html('<object style="width: -webkit-fill-available; height: ' + expandedSectionHeight + 'px;" data="' + encodeURI(getURL(index, "rmp")) + '" />');
            return false;
        });
    }

    // Append UTDGrades Tab

    if(showUTDGradesTab) {
        list.append("<li class=\"lev4-notactive\">" +
            "<a id=\"tab-extension-utdgrades\" style='cursor:pointer'>UTD Grades</a></li>"
        );

        let utdgradesTab = $("#tab-extension-utdgrades").parent();

        utdgradesTab.on("click", function () {
            list.children().removeClass("lev4-active").addClass("lev4-notactive");
            utdgradesTab.removeClass("lev4-notactive").addClass("lev4-active");
            // noinspection CssInvalidPropertyValue
            content.html('<iframe style="width: -webkit-fill-available; height: ' + expandedSectionHeight + 'px;"src="' + encodeURI(getURL(index, "utdgrades")) + '" />');
            return false;
        });
    }
}