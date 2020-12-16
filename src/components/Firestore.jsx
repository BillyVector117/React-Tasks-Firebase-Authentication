import React, { useEffect, useState } from "react";
import { db } from "../firebase"; // Acceder a la configuración de firebase (modulo)
const Firestore = (props) => {
  // Crear state para tasks
  const [tasks, setTasks] = useState([]);
  // Crear state para estado del formulario (relacionarlo)
  const [task, setTask] = useState("");
  // State para cambiar el formulario de crear -editar
  const [editionMode, setEditionMode] = useState(false);
  const [id, setId] = useState("");

  // useEffect para capturar la data de firestore
  useEffect(() => {
    // Obtener data de Firestore
    const getData = async () => {
      try {
        const data = await db.collection(props.user.uid).get(); // Captura todos los docs de la colección del uid del user
        // console.log(data.docs) // Muestra los datos provenientes de firestore (no legibles)
        const arrayData = data.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })); // Data legible, ya que solo leemos el id y la data
        console.log(arrayData); // Devuelve un array con la data legible (la enviamos al state)
        setTasks(arrayData); // Enviamos la data recibida al state tasks
      } catch (error) {
        console.error(error);
      }
    };
    getData(); // Ejecutar función
  }, [props.user.uid]);

  const addTask = async (event) => {
    event.preventDefault();
    // Si no ha escrito algo marca error
    if (!task.trim()) {
      console.log("Must type a task");
      return;
    }
    try {
      const newTask = { name: task, createdAt: Date.now() }; // Definir la data a guardar
      const data = await db.collection(props.user.uid).add(newTask);
      // Montamos la data recibida al state tasks (para que las muestre al usuario)
      setTasks([...tasks, { ...newTask, id: data.id }]); // Capturamos el id aleatorio que firestore coloca por default
      setTask(""); // Limpiar el state
    } catch (error) {
      console.log(error);
    }
    console.log(task);
  };

  const deleteTask = async (id) => {
    try {
      await db.collection(props.user.uid).doc(id).delete(); // De la colección 'task's selecciona el documento con el id pasado y eliminalo
      const filterArray = tasks.filter((item) => item.id !== id); // Filtra tasks, muestra el id de TODAS las tareas que sea diferente al id pasado (clickeado a eliminar)
      setTasks(filterArray); // Montar el array filtrado al state para que se renderice automaticamente
      console.log("task deleted");
    } catch (error) {
      console.log(error);
    }
  };
  // activeEdition() recibe la tarea mapeada.
  const activateEdition = (task) => {
    setEditionMode(true);
    setTask(task.name); // Cambia el value del input (ya que en su propiedad tiene como value 'task')
    setId(task.id); // Montamos en el state 'id' el id de la tarea clickeada a editar
  };
  // updateTask() evento al dar 'submit' en editar
  const updateTask = async (event) => {
    event.preventDefault();
    // Si el input esta vacio (no se ha ejecutado su método .trim() (eliminar espacios), marca error)
    if (!task.trim()) {
      console.log("Need to fill this field");
      return;
    }
    try {
      // El .doc(id) es montado al state de 'id' una vez se activa el modo edición
      // .update() recibe un objecto con los campos a actualizar, no es necesario TODO el objeto
      await db.collection(props.user.uid).doc(id).update({ name: task });
      // Filtramos todas las tareas, el doc. que tenga el mismo id al que clickeamos 'edit' actualizara sus datos
      const filterArray = tasks.map((item) =>
        item.id === id
          ? { id: item.id, createdAt: item.createdAt, name: task }
          : item
      );
      setTasks(filterArray); // Montar en el state de tareas el array filtrado (actualizadó)
      setEditionMode(false); // Remueve el modo edición del form
      setTask(""); // el input se formateara
      setId(""); // El id vacio ya que no hay operaciones
      console.log("task updated!");
    } catch (error) {
      console.log(error);
    }
  };

  // Retorna una estructura HTML junto con los documentos capturados por firestore
  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-md-6">
          <ul className="list-group">
            {tasks.map((task) => (
              <li className="list-group-item" key={task.id}>
                <b>{task.name}</b>
                {/* .name es una propiedad del objeto/document de firestore, pero se encuentra dentro del objecto del state 'tasks' */}
                <button
                  className="btn btn-danger btn-sm d-flex float-right"
                  onClick={() => deleteTask(task.id)} // Al clickear le pasamos como argumento el id de la tarea (Por el .map)
                >
                  Delete
                </button>
                <button
                  className="btn btn-warning btn-sm d-flex float-right mr-3"
                  onClick={() => activateEdition(task)} // Activamos el form para editar, enviandole la tarea COMPLETA mapeada
                >
                  Edit
                </button>
              </li>
            ))}
          </ul>
        </div>
        {/* En la otra columna se mostrara un Form */}
        <div className="col-md-6">
          <h3> {editionMode ? "Update task" : "Add new task"}</h3>
          <form onSubmit={editionMode ? updateTask : addTask}>
            <input
              type="text"
              placeholder="Add New Task"
              className="form-control mb-2"
              // En cada cambio del input, el evento captura lo typeado y lo envia al state "task"
              onChange={(event) => setTask(event.target.value)}
              value={task} // El valor por defecto del input es la tarea
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
