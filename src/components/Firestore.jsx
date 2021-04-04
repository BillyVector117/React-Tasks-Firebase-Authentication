import React, { useEffect, useState } from "react";
// Functions
import { db } from "../firebase";
// Dependencies
import moment from "moment"; // Allows to use Date() methods
import "moment/locale/es"; // Moment 'ES'
// ¿props' contains full user Object from 'Admin.jsx'
const Firestore = (props) => {
  const [tasks, setTasks] = useState([]); // Database documents
  const [task, setTask] = useState(""); // Match input-Form
  const [editionMode, setEditionMode] = useState(false); //Form-edit (enable-disable)
  const [id, setId] = useState("");
  // Pagination state
  const [ultimo, setUltimo] = useState(null); // Read last stored document
  const [desactive, setDesactive] = useState(false); // Disabled 'next' button if no found documents

  // Capture data(documents/tasks) from database
  useEffect(() => {
    const getData = async () => {
      try {
        setDesactive(true); // Disable 'Load More' button
        // Get limited documents of current user (each user has its cown collection)
        const data = await db
          .collection(props.user.uid)
          .limit(2)
          .orderBy("createdAt", "desc")
          .get();
        // console.log(data.docs) // No-legible data
        const arrayData = data.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })); // Legible-data in array-Format
        setUltimo(data.docs[data.docs.length - 1]); // Capture the last document
        console.log("LEGIBLE DATA: ", arrayData); // Returns Legible-data in array-format, that will set in 'tasks' state (To render in HTML)
        setTasks(arrayData);
        // Second query, The searching starts after last document of the last query
        const query = await db
          .collection(props.user.uid)
          .limit(2)
          .orderBy("createdAt", "desc")
          .startAfter(data.docs[data.docs.length - 1]) // Start after last found document
          .get();
        // disable 'Load-more' button if query no found items
        if (query.empty) {
          console.log("No documents to load");
          setDesactive(true);
        } else {
          // activate 'load-more' button
          setDesactive(false);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getData();
  }, [props.user.uid]);

  const nextPage = async () => {
    // console.log("Next page!");
    try {
      // 'data' returns No-legible data
      const data = await db
        .collection(props.user.uid)
        .limit(2)
        .orderBy("createdAt", "desc")
        .startAfter(ultimo) // Start after last found document ('ultimo' state)
        .get();
      // 'arrayData' returns an array with Legible-data
      const arrayData = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks([...tasks, ...arrayData]); // Combine the current tasks with the news (2)
      setUltimo(data.docs[data.docs.length - 1]); // 'ultimo' state will change every 'load-more' button is clicked
      const query = await db
        .collection(props.user.uid)
        .limit(2)
        .orderBy("createdAt", "desc")
        .startAfter(data.docs[data.docs.length - 1]) // 'ultimo' state
        .get();
      // disable 'Load-more' button if query no found items
      if (query.empty) {
        console.log("No documents to load");
        setDesactive(true);
      } else {
        // activate 'load-more' button
        setDesactive(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // CREATE/ADD document (by default 'editionMode' state is false)
  const addTask = async (event) => {
    event.preventDefault();
    // Validate input value
    if (!task.trim()) {
      console.log("Must type a task");
      return;
    }
    // Success case:
    try {
      const newTask = { name: task, createdAt: Date.now() }; // Define data with input-value as 'name'
      const data = await db.collection(props.user.uid).add(newTask);
      // Add to 'tasks' state the previous contained object and the new one, but adding 'id' key with the new random generated Firebase's ID
      setTasks([...tasks, { ...newTask, id: data.id }]);
      setTask("");
      console.log("Task added: ", task);
    } catch (error) {
      console.log(error);
    }
  };

  // DELETE DOCUMENT
  const deleteTask = async (id) => {
    try {
      await db.collection(props.user.uid).doc(id).delete();
      const filterArray = tasks.filter((item) => item.id !== id); // Filter 'tasks' state (Array) and exclude the current deleted item
      setTasks(filterArray); // Set the filterArray to 'tasks' state
      console.log("task deleted :)");
    } catch (error) {
      console.log(error);
    }
  };
  // Change Create/add-Form TO Edit-Form )
  const activateEdition = (task) => {
    setEditionMode(true); // Allows to activate Edit-Form
    setTask(task.name); // Set task.name content to Task-Input value
    setId(task.id); // Set at 'id' state the clicked document's ID
  };
  // UPDATE DOCUMENT-Submit-Form (receive the complete Task Object (maped))
  const updateTask = async (event) => {
    event.preventDefault();
    // Prevent Empty task
    if (!task.trim()) {
      console.log("Need to fill this field");
      return;
    }
    try {
      // 'id' refers to the set value in activateEdition() 'id' state, so, select that document and update ONLY NECESSARY FIELDS (Avoid type all Properties object)
      await db.collection(props.user.uid).doc(id).update({ name: task });
      // Filter all tasks and update the current edited-task (To set at 'tasks' state)
      const filterArray = tasks.map((item) =>
        item.id === id
          ? { id: item.id, createdAt: item.createdAt, name: task }
          : item
      );
      setTasks(filterArray); // Set updated tasks array
      setEditionMode(false); // Remove edition-Form mode
      setTask(""); // Clean input
      setId("");
      console.log("task updated!");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-md-6">
          <ul className="list-group">
            {tasks.map((task) => (
              <li className="list-group-item mb-2" key={task.id}>
                <b>{task.name}</b>
                <button
                  className="btn btn-danger btn-sm d-flex float-right"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>
                <button
                  className="btn btn-warning btn-sm d-flex float-right mr-3"
                  onClick={() => activateEdition(task)} // Activate Edit-Form, sending full task Object
                >
                  Edit
                </button>
                <p className="moment d-block">
                  Created at: {moment(task.createdAt).format("LLL")}
                </p>
              </li>
            ))}
          </ul>
          <button
            className="btn btn-info mt-2 btn-sm"
            onClick={() => nextPage()}
            disabled={desactive}
          >
            Next page
          </button>
        </div>
        {/* Form in this column */}
        <div className="col-md-6">
          <h3> {editionMode ? "Update task" : "Add new task"}</h3>
          <form onSubmit={editionMode ? updateTask : addTask}>
            <input
              type="text"
              placeholder="Add New Task"
              className="form-control mb-2"
              onChange={(event) => setTask(event.target.value)}
              value={task} // Set the typed task to 'task' state
            />
            <button
              className={
                editionMode
                  ? "btn btn-warning btn-block"
                  : " btn btn-dark btn-block"
              }
              type="submit"
            >
              {editionMode ? "Save changes" : "Add task"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Firestore;
