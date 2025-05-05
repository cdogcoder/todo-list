import "./styles.css"

// My pseudocode 

// 1. Create a function that appends a new project as an object to another object 'projects' upon button click.
//    The user should be able to click an associated button to add a new project to their collection of projects,
//    and then have it open a new project window on the webpage, where they can start adding todo items 
//    immediately. The new project should be stored as a key-value pair in the 'projects' object, where the key 
//    is the title of the project and the value is an empty list. The new project window should be generated via 
//    the DOM.
// 2. Create a function that deletes a project upon button click. The user should be able to click an associated button
//    to delete a project from their collection of projects and have the first project listed appear back on screen
//    after the button has been clicked. 
// 3. Create a function that appends todo items as objects to a project list upon button click. The user should be 
//    able to click an associated button to add a new todo item to a project and immediately see the change reflected 
//    on the webpage. The new todo item should be stored as an object with a series of key-value pairs in the associated 
//    project list, where the keys are todo item properties (at minimum, include a title, description, dueDate, and priority). 
// 4. Create a function that deletes a todo item upon button click. The user should be able to click an associated 
//    button to delete a todo item within a project and have the change be immediately reflected on the webpage.
// 5. Create a function that edits todo items' properties upon button click. The user should be able to click an associated
//    button, edit any of the properties listed on a todo item and save the changes through a dialog popup, and have the changes
//    immediately reflected in the webpage. The appropriate todo item object should be found within the project list and
//    the properties that were changed should be updated via their keys within the todo item object. Since the functionality
//    of the main edit function may be complicated, split the edit functions into different functions that the main edit function
//    can call on whenever a todo item property is changed.
// 6. Create a function that expands and collapses todo items upon button click. The user should be able to click an associated
//    button and see a todo item expanding to show more content, or collapse to conserve space. The functionality should use a toggle
//    method to determine whether the todo item needs to be expanded or collapsed (all items should start collapsed). Consider refactoring 
//    the code to use an additional property for this. This change will be purely visual (perhaps adding some sort of CSS animation or 
//    something similar) and nothing should change about the todo item's object reference aside from the property that determines its 
//    expand/collapse state.
// 7. When the program is first opened in a live server, no project should be opened in the main window and the collection of projects 
//    should appear empty on the left hand side of the web page. Any changes that occur on the web page thereafter (creating a new project,
//    creating todo items, editing todo items, deleting todo items, etc) should be saved to local storage (find out how to implement local
//    storage online).

const projects = {}

function createProject(projectTitle, projectDescription) {
    projects[projectTitle] = [projectDescription];
    displayProjectAndItems();
}

function displayProjectsList() {
    const projectTitles = Object.keys(projects).reverse();
    const projectsList = document.querySelector(".projects-list");
    projectsList.innerHTML = "";
    for (let projectTitle of projectTitles) {
        const projectSave = document.createElement("li");
        projectSave.classList = "project-save";
        projectSave.textContent = projectTitle;
        projectsList.appendChild(projectSave);
    }
}

function displayProjectAndItems() {
    const projectTitles = Object.keys(projects).reverse();
    const projectDescriptions = Object.values(projects).map((value) => value[0]).reverse();
    const projectTodoItems = Object.values(projects).map((value) => value.slice(1)).reverse();

    const projectTitle = document.querySelector(".project-title");
    const projectDescription = document.querySelector(".project-description");
    const addTodoItemButton = document.querySelector(".add-todo-item-button");
    const mainWindow = document.querySelector(".main-window");
    const projectsList = document.querySelector(".projects-list");
    if (!projectTitles.length) {
        projectTitle.textContent = "No project available";
        projectDescription.textContent = 'Click the "Add Project" button to start planning.';
        addTodoItemButton.style.cssText = "display: none";
        mainWindow.innerHTML = "";
        projectsList.innerHTML = "";
    } else {
        const newestCreatedProjectTitle = projectTitles[0];
        const newestCreatedProjectDescription = projectDescriptions[0];
        const newestCreatedProjectTodoItems = projectTodoItems[0];
        
        projectTitle.textContent = newestCreatedProjectTitle;
        projectDescription.textContent = newestCreatedProjectDescription;
        addTodoItemButton.style.cssText = "display: block";
        projectTodoItems.textContent = newestCreatedProjectTodoItems;
        if (!newestCreatedProjectTodoItems.length) {
            mainWindow.textContent = "nothing yet";
        } else {
            mainWindow.textContent = "skibidize";
        }
        displayProjectsList();

    }
}