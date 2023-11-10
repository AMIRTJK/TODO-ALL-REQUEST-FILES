import { useEffect, useState, useRef, forwardRef } from "react";
import axios from "axios";
import "./App.css";
import Modals from "./component/Modals";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

import {
  Box,
  Typography,
  Stack,
  Container,
  TextField,
  Button,
  Avatar,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Checkbox,
  Snackbar,
} from "@mui/material/";
import MuiAlert from "@mui/material/Alert";

function App() {
  // API
  const API = "http://localhost:3000/data";

  // useState for Data
  const [data, setData] = useState([]);

  // Async GET
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Status");
  async function getData() {
    let apiTemp = API;
    if (search != "") apiTemp = `${API}?q=${search}`;
    if (filter != "All Status") apiTemp = `${API}?isComplete=${filter}`;
    try {
      const { data } = await axios.get(apiTemp);
      setData(data);
    } catch (error) {
      console.error(error);
    }
  }

  // Async DELETE
  async function deleteData(clickedElement) {
    try {
      const { data } = await axios.delete(`${API}/${clickedElement.id}`);
      getData();
    } catch (error) {
      console.error(error);
    }
  }

  // Async PUT - Complete
  async function putComplete(clickedElement) {
    const newObj = {
      id: clickedElement.id,
      image: clickedElement.image,
      name: clickedElement.name,
      age: clickedElement.age,
      email: clickedElement.email,
      isComplete: !clickedElement.isComplete,
    };
    try {
      const { data } = await axios.put(`${API}/${clickedElement.id}`, newObj);
      getData();
    } catch (error) {
      console.error(error);
    }
  }

  // Modal Add
  const [modalAdd, setModalAdd] = useState(false);
  const [nameAdd, setNameAdd] = useState("");
  const [ageAdd, setAgeAdd] = useState("");
  const [emailAdd, setEmailAdd] = useState("");
  // Async POST - File
  const [imageAdd, setImageAdd] = useState(null);
  async function postFile(files) {
    try {
      const file = files;
      const reader = new FileReader();
      reader.onload = () => {
        const newImage = reader.result;
        setImageAdd(newImage);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
    }
  }

  // Async POST

  async function postData(event) {
    event.preventDefault();
    setModalAdd(false);
    const newObj = {
      image: imageAdd,
      name: nameAdd,
      age: ageAdd,
      email: emailAdd,
      isComplete: false,
    };

    try {
      const { data } = await axios.post(API, newObj);
      getData();
      setImageAdd("");
      setNameAdd("");
      setAgeAdd("");
      setEmailAdd("");
    } catch (error) {
      console.error(error);
    }
  }

  // Modal Edit
  const [modalEdit, setModalEdit] = useState(false);
  // Async PUT - File
  const [imageEdit, setImageEdit] = useState(null);
  const [nameEdit, setNameEdit] = useState("");
  const [ageEdit, setAgeEdit] = useState("");
  const [emailEdit, setEmailEdit] = useState("");
  async function putFile(files) {
    try {
      const file = files;
      const reader = new FileReader();
      reader.onload = () => {
        const newImage = reader.result;
        setImageEdit(newImage);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
    }
  }

  const [editObject, setEditObject] = useState("");

  // input edit
  function inputEdit(clickedElement) {
    setModalEdit(true);
    setImageEdit(clickedElement.image);
    setNameEdit(clickedElement.name);
    setAgeEdit(clickedElement.age);
    setEmailEdit(clickedElement.email);
    setEditObject(clickedElement);
  }

  async function putData(event) {
    event.preventDefault();
    const newObj = {
      image: imageEdit,
      name: nameEdit,
      age: ageEdit,
      email: emailEdit,
      isComplete: editObject.isComplete,
    };
    try {
      const { data } = await axios.put(`${API}/${editObject.id}`, newObj);
      getData();
      setModalEdit(false);
    } catch (error) {
      console.error(error);
    }
  }

  // Copy

  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  // useEffect for update async functions
  useEffect(() => {
    getData();
  }, [search, filter]);
  return (
    <>
      <main className="dark:bg-[#000] dark:text-[#fff] px-[60px]">
        <header>
          <nav className="flex gap-[50px] justify-between items-center py-[30px]">
            <a href="">
              <h1 className="text-[35px] font-[500] text-[#4588be]">TODO</h1>
            </a>
            <TextField
              onChange={(event) => setSearch(event.target.value)}
              value={search}
              label="Search..."
              fullWidth
            />
            <fieldset className="h-[56px] w-[50%]  border-[1px] border-[#aeaeae] rounded-[5px] px-[10px] ">
              <select
                onChange={(event) => setFilter(event.target.value)}
                value={filter}
                className="h-[100%] w-[100%] outline-none "
              >
                <option value="All Status" className="font-[500]">
                  All Status
                </option>
                <option value="false" className="font-[500]">
                  ACTIVE
                </option>
                <option value="true" className="font-[500]">
                  INACTIVE
                </option>
              </select>
            </fieldset>
            <Button
              onClick={() => setModalAdd(true)}
              variant="outlined"
              sx={{ width: "20%", height: "56px" }}
            >
              Add Task
            </Button>
          </nav>
        </header>
        {/* ToDo */}
        <div className="wrapper-post py-[50px]">
          {data.map((e) => {
            return (
              <div
                key={e.id}
                className="post flex justify-between items-center border-b-[1px] border-[#000] py-[10px]"
              >
                <div
                  className={`${
                    e.isComplete ? "opacity-[60%]" : "opacity-[100%]"
                  } wrapper-text flex items-center gap-[50px]`}
                >
                  <Avatar
                    src={e.image}
                    onClick={() => {
                      handleClick();
                      handleCopy(e.image);
                    }}
                  />
                  <p
                    className="text-[18px] font-[500] min-w-[150px]"
                    onClick={() => {
                      handleClick();
                      handleCopy(e.name);
                    }}
                  >
                    {e.name}
                  </p>
                  <p
                    className="text-[18px] font-[500] min-w-[150px]"
                    onClick={() => {
                      handleClick();
                      handleCopy(e.age);
                    }}
                  >
                    {e.age}
                  </p>

                  <p
                    className="text-[18px] font-[500] min-w-[150px]"
                    onClick={() => {
                      handleClick();
                      handleCopy(e.email);
                    }}
                  >
                    {e.email}
                  </p>
                </div>
                <div className="panel-control flex items-center gap-[20px]">
                  <IconButton
                    onClick={() => {
                      inputEdit(e);
                    }}
                  >
                    <EditIcon className="text-[#2fb12f]" />
                  </IconButton>
                  <Checkbox
                    onChange={() => putComplete(e)}
                    checked={e.isComplete}
                  />
                  <IconButton onClick={() => deleteData(e)}>
                    <DeleteIcon className="text-[red]" />
                  </IconButton>
                </div>
              </div>
            );
          })}
          {/* Ищем, если в объектах все isComplete имеют значение false то выводим на экран надпись */}
          <div
            className={`${
              filter === "true" && data.every((e) => !e.isComplete)
                ? "block"
                : "hidden"
            } messageNotFound flex justify-center text-[30px]`}
          >
            <p>Неактивных не найдено</p>
          </div>
        </div>
        <Modals children modal={modalAdd} setModal={setModalAdd}>
          <form
            onSubmit={(event) => postData(event)}
            className="flex flex-col items-center p-[20px] gap-[20px]"
          >
            <div className="wrapper-text flex justify-between items-center w-[100%]">
              <p className="text-[20px] font-[600] mx-auto">Add Task</p>
              <IconButton onClick={() => setModalAdd(false)}>
                <CloseIcon />
              </IconButton>
            </div>
            <div className="wrapper-image flex justify-between items-center gap-[20px] w-[100%]">
              <TextField
                fullWidth
                type="file"
                onChange={(event) => postFile(event.target.files[0])}
              />
              <Avatar
                onClick={() => {
                  confirm("Вы точно хотите удалить?")
                    ? setImageAdd(null)
                    : "none";
                }}
                sx={{
                  display: `${imageAdd ? "inline" : "none"}`,
                }}
                src={imageAdd}
              />
            </div>
            <TextField
              value={nameAdd}
              onChange={(event) => setNameAdd(event.target.value)}
              label="Name"
              fullWidth
            />
            <TextField
              value={ageAdd}
              onChange={(event) => setAgeAdd(event.target.value)}
              label="Age"
              fullWidth
            />
            <TextField
              value={emailAdd}
              onChange={(event) => setEmailAdd(event.target.value)}
              label="Email"
              fullWidth
            />
            <Button type="submit">Submit</Button>
          </form>
        </Modals>
        <Modals children modal={modalEdit} setModal={setModalEdit}>
          <form
            onSubmit={(event) => putData(event)}
            className="flex flex-col items-center p-[20px] gap-[20px]"
          >
            <div className="wrapper-text flex justify-between items-center w-[100%]">
              <p className="text-[20px] font-[600] mx-auto">Edit Task</p>
              <IconButton onClick={() => setModalEdit(false)}>
                <CloseIcon />
              </IconButton>
            </div>
            <div className="wrapper-image flex justify-between items-center gap-[20px] w-[100%]">
              <TextField
                fullWidth
                type="file"
                onChange={(event) => putFile(event.target.files[0])}
              />
              <Avatar
                onClick={() => {
                  confirm("Вы точно хотите удалить?")
                    ? setImageEdit(null)
                    : "none";
                }}
                sx={{
                  display: `${imageEdit ? "inline" : "none"}`,
                }}
                src={imageEdit}
              />
            </div>
            <TextField
              value={nameEdit}
              onChange={(event) => setNameEdit(event.target.value)}
              label="Name"
              fullWidth
            />
            <TextField
              value={ageEdit}
              onChange={(event) => setAgeEdit(event.target.value)}
              label="Age"
              fullWidth
            />
            <TextField
              value={emailEdit}
              onChange={(event) => setEmailEdit(event.target.value)}
              label="Email"
              fullWidth
            />
            <Button type="submit">Submit</Button>
          </form>
        </Modals>
        {/* Copy */}
        <Snackbar open={open} autoHideDuration={2500} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Скопировано
          </Alert>
        </Snackbar>
      </main>
    </>
  );
}

export default App;
