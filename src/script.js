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

let projects = {};

window.addEventListener("load", () => {
    projects = JSON.parse(window.localStorage.getItem("projects"));
    console.log(projects)
    displayProjectsList();
    displayProjectAndItems();
})

function addProject(projectTitle, projectDescription) {
    projects[projectTitle] = [projectDescription];
    window.localStorage.setItem("projects", JSON.stringify(projects));
    displayProjectAndItems();
}

function saveNewProject() {
    const newProjectTitleInput = document.querySelector("#new-project-title");
    const newProjectDescriptionInput = document.querySelector("#new-project-description");
    if (newProjectTitleInput.value && newProjectDescriptionInput.value){
        addProject(newProjectTitleInput.value, newProjectDescriptionInput.value);
        newProjectTitleInput.value = "";
        newProjectDescriptionInput.value = "";
        addProjectDialog.close()
    }
}

function openProjectSave(projectSaveTitle) {
    const projectTitles = Object.keys(projects).reverse();
    const projectDescriptions = Object.values(projects).map((value) => value[0]).reverse();
    const projectTodoItems = Object.values(projects).map((value) => value.slice(1)).reverse();

    const projectIndex = projectTitles.findIndex((projectTitle) => projectTitle == projectSaveTitle);
    displayProjectAndItems(projectTitles[projectIndex], projectDescriptions[projectIndex], projectTodoItems[projectIndex]);
}

function deleteProject(selectedProjectTitle) {
    delete projects[selectedProjectTitle];
    window.localStorage.setItem("projects", JSON.stringify(projects));
    displayProjectsList();
    displayProjectAndItems();
}

function saveNewTodoItem() {
    const newTodoItemTitleInput = document.querySelector("#new-todo-item-title");
    const newTodoItemDescriptionInput = document.querySelector("#new-todo-item-description");
    const newTodoItemDueDateInput = document.querySelector("#new-todo-item-due-date");
    const newTodoItemPriorityInput = document.querySelector("#new-todo-item-priority");
    if (newTodoItemTitleInput.value && newTodoItemDescriptionInput.value && newTodoItemDueDateInput.value && newTodoItemPriorityInput.value) {
        addTodoItem(newTodoItemTitleInput.value, newTodoItemDescriptionInput.value, newTodoItemDueDateInput.value, newTodoItemPriorityInput.value);
        newTodoItemTitleInput.value = "";
        newTodoItemDescriptionInput.value = "";
        newTodoItemDueDateInput.value = "";
        newTodoItemPriorityInput.value = "";
        addTodoItemDialog.close();
    }
}

function addTodoItem(itemTitle, itemDescription, itemDueDate, itemPriority) {
    const currentProjectTitle = document.querySelector(".project-title").textContent;
    const currentProjectDescription = document.querySelector(".project-description").textContent;
    const todoItem = {
        title: itemTitle,
        description: itemDescription,
        dueDate: itemDueDate,
        priority: itemPriority
    }
    projects[currentProjectTitle].push(todoItem);
    const currentProjectTodoItems = projects[currentProjectTitle].slice(1);
    window.localStorage.setItem("projects", JSON.stringify(projects));
    displayProjectAndItems(currentProjectTitle, currentProjectDescription, currentProjectTodoItems);
}

function deleteTodoItem(itemTitle) {
    const currentProjectTitle = document.querySelector(".project-title").textContent;
    const currentProjectDescription = projects[currentProjectTitle][0];
    let currentProjectTodoItems = projects[currentProjectTitle].slice(1);
    const selectedProjectTodoItemIndex = currentProjectTodoItems.findIndex(item => itemTitle == item["title"]);
    currentProjectTodoItems.splice(selectedProjectTodoItemIndex, 1);
    projects[currentProjectTitle] = [currentProjectDescription, ...currentProjectTodoItems];
    window.localStorage.setItem("projects", JSON.stringify(projects));
    displayProjectAndItems(currentProjectTitle, currentProjectDescription, currentProjectTodoItems);
}

function editTodoItem(originalItemTitle, editedItemTitle, editedItemDescription, editedItemDueDate, editedItemPriority) {
    const currentProjectTitle = document.querySelector(".project-title").textContent;
    const currentProjectDescription = projects[currentProjectTitle][0];
    let currentProjectTodoItems = projects[currentProjectTitle].slice(1);
    const selectedProjectTodoItemIndex = currentProjectTodoItems.findIndex(item => originalItemTitle == item["title"]);
    currentProjectTodoItems[selectedProjectTodoItemIndex] = {
        title: editedItemTitle,
        description: editedItemDescription,
        dueDate: editedItemDueDate,
        priority: editedItemPriority
    }
    projects[currentProjectTitle] = [currentProjectDescription, ...currentProjectTodoItems];
    window.localStorage.setItem("projects", JSON.stringify(projects));
    displayProjectAndItems(currentProjectTitle, currentProjectDescription, currentProjectTodoItems);
}

function saveItemEditChanges() {
    const editTodoItemTitleInput = document.querySelector("#edit-todo-item-title");
    const editTodoItemDescriptionInput = document.querySelector("#edit-todo-item-description");
    const editTodoItemDueDateInput = document.querySelector("#edit-todo-item-due-date");
    const editTodoItemPriorityInput = document.querySelector("#edit-todo-item-priority");
    editTodoItem(editTodoItemTitleInput.defaultValue, editTodoItemTitleInput.value, editTodoItemDescriptionInput.value, editTodoItemDueDateInput.value, editTodoItemPriorityInput.value);
    editTodoItemTitleInput.value = "";
    editTodoItemDescriptionInput.value = "";
    editTodoItemDueDateInput.value = "";
    editTodoItemPriorityInput.value = "";
}

function createAndAppendDOMItemElements(item) {
    const mainWindow = document.querySelector(".main-window");
    const editTodoItemDialog = document.querySelector(".edit-todo-item-dialog");
    const formattedItemDate = [...item["dueDate"].split("-").slice(1), item["dueDate"].split("-")[0]].join("/");
    const todoItem = document.createElement("div");
    todoItem.classList = "todo-item";
    const todoItemInformation = document.createElement("div");
    todoItemInformation.classList = "todo-item-information";
    const todoItemTitle = document.createElement("p");
    todoItemTitle.classList = "todo-item-title";
    todoItemTitle.textContent = item["title"];
    const todoItemProperties = document.createElement("p");
    todoItemProperties.classList = "todo-item-properties";
    const todoItemDescription = document.createElement("span");
    todoItemDescription.classList = "todo-item-description";
    todoItemDescription.textContent = item["description"];
    const todoItemDueDate = document.createElement("span");
    todoItemDueDate.classList = "todo-item-due-date";
    todoItemDueDate.textContent = `Due: ${formattedItemDate}`;
    const todoItemPriority = document.createElement("span");
    todoItemPriority.classList = "todo-item-priority";
    if (item["priority"] == "High") {
        todoItem.classList = "todo-item high-priority";
    } else if (item["priority"] == "Medium") {
        todoItem.classList = "todo-item medium-priority";
    } else if (item["priority"] == "Low") {
        todoItem.classList = "todo-item low-priority"; 
    }
    todoItemPriority.textContent = `Priority: ${item["priority"]}`;
    const todoItemButtonsContainer = document.createElement("div");
    todoItemButtonsContainer.classList = "todo-item-buttons-container";
    const editTodoItemButton = document.createElement("button");
    editTodoItemButton.classList = "edit-todo-item-button";
    editTodoItemButton.textContent = "Edit";
    editTodoItemButton.addEventListener("click", () => {
        editTodoItemDialog.showModal();
        const editTodoItemTitleInput = document.querySelector("#edit-todo-item-title");
        const editTodoItemDescriptionInput = document.querySelector("#edit-todo-item-description");
        const editTodoItemDueDateInput = document.querySelector("#edit-todo-item-due-date");
        const editTodoItemPriorityInput = document.querySelector("#edit-todo-item-priority");
        console.log(item["title"], item["description"], item["dueDate"], item["priority"])
        console.log(editTodoItemTitleInput.defaultValue)
        editTodoItemTitleInput.value = item["title"];
        editTodoItemTitleInput.defaultValue = item["title"];
        editTodoItemDescriptionInput.value = item["description"];
        editTodoItemDueDateInput.value = item["dueDate"];
        editTodoItemPriorityInput.value = item["priority"];
    });
    const deleteTodoItemButton = document.createElement("button");
    deleteTodoItemButton.classList = "delete-todo-item-button";
    deleteTodoItemButton.textContent = "Delete";
    deleteTodoItemButton.addEventListener("click", () => deleteTodoItem(item["title"]));
    todoItemProperties.appendChild(todoItemDescription);
    todoItemProperties.appendChild(todoItemDueDate);
    todoItemProperties.appendChild(todoItemPriority);
    todoItemButtonsContainer.appendChild(editTodoItemButton);
    todoItemButtonsContainer.appendChild(deleteTodoItemButton);
    todoItemInformation.appendChild(todoItemTitle);
    todoItemInformation.appendChild(todoItemProperties);
    todoItem.appendChild(todoItemInformation);
    todoItem.appendChild(todoItemButtonsContainer);
    mainWindow.appendChild(todoItem);
}

function displayProjectsList() {
    const projectTitles = Object.keys(projects).reverse();
    const projectsList = document.querySelector(".projects-list");
    projectsList.innerHTML = "";
    for (let projectTitle of projectTitles) {
        const projectSaveLabel = document.createElement("li");
        projectSaveLabel.classList = "project-save-label";
        const projectSave = document.createElement("p");
        projectSave.classList = "project-save";
        const deleteProjectButton = document.createElement("button");
        deleteProjectButton.classList = "delete-project-button";
        deleteProjectButton.style.cssText = "display: none;"
        deleteProjectButton.textContent = "X";
        deleteProjectButton.addEventListener("click", () => {
            deleteProject(projectTitle);
        })
        projectSaveLabel.addEventListener("mouseover", () => {
            deleteProjectButton.style.cssText = "display: block;";
        })
        projectSaveLabel.addEventListener("mouseout", () => {
            deleteProjectButton.style.cssText = "display: none;";
        })
        projectSave.textContent = projectTitle;
        projectSave.addEventListener("click", () => {
            openProjectSave(projectTitle);
        })
        projectSaveLabel.appendChild(projectSave);
        projectSaveLabel.appendChild(deleteProjectButton);
        projectsList.appendChild(projectSaveLabel);
    }
}

function displayProjectAndItems(selectedProjectTitle = null, selectedProjectDescription = null, selectedProjectTodoItems = null) {
    const projectTitles = Object.keys(projects).reverse();
    const projectDescriptions = Object.values(projects).map((value) => value[0]).reverse();
    const projectTodoItems = Object.values(projects).map((value) => value.slice(1)).reverse();

    const projectTitle = document.querySelector(".project-title");
    const projectDescription = document.querySelector(".project-description");
    const addTodoItemButton = document.querySelector(".add-todo-item-button");
    const mainWindow = document.querySelector(".main-window");
    const projectsList = document.querySelector(".projects-list");
    
    mainWindow.innerHTML = "";
    if (!projectTitles.length) {
        projectTitle.textContent = "No project available";
        projectDescription.textContent = 'Click the "Add Project" button to start planning.';
        addTodoItemButton.style.cssText = "display: none";
        mainWindow.innerHTML = "";
        projectsList.innerHTML = "";
    } else if (selectedProjectTitle !== null && selectedProjectDescription !== null && selectedProjectTodoItems !== null) {
        projectTitle.textContent = selectedProjectTitle;
        projectDescription.textContent = selectedProjectDescription;
        if (!selectedProjectTodoItems.length) {
            mainWindow.textContent = "nothing yet"; 
        } else {
            selectedProjectTodoItems.forEach((item) => createAndAppendDOMItemElements(item))
        }
    } else {
        const newestCreatedProjectTitle = projectTitles[0];
        const newestCreatedProjectDescription = projectDescriptions[0];
        const newestCreatedProjectTodoItems = projectTodoItems[0];
        
        projectTitle.textContent = newestCreatedProjectTitle;
        projectDescription.textContent = newestCreatedProjectDescription;
        addTodoItemButton.style.cssText = "display: block";

        if (!newestCreatedProjectTodoItems.length) {
            mainWindow.textContent = "nothing yet";
        } else {
            newestCreatedProjectTodoItems.forEach((item) => createAndAppendDOMItemElements(item));
        }
        displayProjectsList();
    }
}

const addProjectDialog = document.querySelector(".add-project-dialog")
const addProjectButton = document.querySelector(".add-project-button");
addProjectButton.addEventListener("click", () => {
    addProjectDialog.showModal();
})

const cancelNewProjectButton = document.querySelector(".cancel-new-project-button");
cancelNewProjectButton.addEventListener("click", () => {
    addProjectDialog.close();
})

const saveNewProjectButton = document.querySelector(".save-new-project-button");
saveNewProjectButton.addEventListener("click", saveNewProject);

const addTodoItemDialog = document.querySelector(".add-todo-item-dialog");
const addTodoItemButton = document.querySelector(".add-todo-item-button");
addTodoItemButton.addEventListener("click", () => {
    addTodoItemDialog.showModal();
})

const cancelNewTodoItemButton = document.querySelector(".cancel-new-todo-item-button");
cancelNewTodoItemButton.addEventListener("click", () => {
    addTodoItemDialog.close();
})

const saveNewTodoItemButton = document.querySelector(".save-new-todo-item-button");
saveNewTodoItemButton.addEventListener("click", saveNewTodoItem);

const saveEditTodoItemButton = document.querySelector(".save-edit-todo-item-button");
saveEditTodoItemButton.addEventListener("click", saveItemEditChanges);