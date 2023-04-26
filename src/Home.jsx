import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "../components/Navbar/Navbar";
import Board from "../components/Board/Board";
// import data from '../data'
import { DragDropContext } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import Editable from "../components/Editable/Editable";
import useLocalStorage from "use-local-storage";
import "../bootstrap.css";
import Axios from '../src/utils/Axios'

function Home() {
  const [data, setData] = useState([]);

  const defaultDark = window.matchMedia(
    "(prefers-colors-scheme: dark)"
  ).matches;
  const [theme, setTheme] = useLocalStorage(
    "theme",
    defaultDark ? "dark" : "light"
  );

  const fetchData = async () => {
    try {
      const request = await Axios.get('/api/tasks/board/')
      setData(request.data?.data)
    }
    catch (e) {
      alert('Something went wrong')
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const setName = async (title, bid) => {
    try {
      await Axios.patch(`/api/tasks/board/${bid}/`, {
        name: title
      })
      fetchData()
    }
    catch (e) {
      console.log(e);
    }
  };

  const dragCardInBoard = (source, destination) => {
    let tempData = [...data];
    const destinationBoardIdx = tempData.findIndex(
      (item) => item.id.toString() === destination.droppableId
    );
    const sourceBoardIdx = tempData.findIndex(
      (item) => item.id.toString() === source.droppableId
    );
    tempData[destinationBoardIdx].card.splice(
      destination.index,
      0,
      tempData[sourceBoardIdx].card[source.index]
    );
    tempData[sourceBoardIdx].card.splice(source.index, 1);

    return tempData;
  };



  const addCard = async (title, bid) => {
    try {
      await Axios.post('/api/tasks/task/', {
        task_description: title,
        board: bid
      })
      fetchData()
    }
    catch (e) {
      console.log(e);
    }
  };

  const removeCard = async (boardId, cardId) => {
    try {
      await Axios.delete(`/api/tasks/task/${cardId}/`)
      fetchData()
    }
    catch (e) {
      console.log(e);
    }
  };

  const addBoard = async (title) => {
    try {
      await Axios.post('/api/tasks/board/', {
        name: title
      })
      fetchData()
    }
    catch (e) {
      console.log(e);
    }
  }

  const removeBoard = async (bid) => {
    try {
      await Axios.delete(`/api/tasks/board/${bid}/`)
      fetchData()
    }
    catch (e) {
      console.log(e);
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    const sourceIndex = data.findIndex(item => item.id?.toString() === source?.droppableId)
    const endIndex = data.findIndex(item => item.id?.toString() === destination?.droppableId)
    const draggableContent = data[sourceIndex].tasks?.find(item => item.id?.toString() === draggableId)

    let newData = [...data]
    newData[sourceIndex].tasks = newData[sourceIndex].tasks?.filter(item => item.id.toString() !== draggableId)
    newData[endIndex]?.tasks?.push(draggableContent)
    setData(newData)

    await removeCard('', parseInt(draggableId))
    await addCard(draggableContent.task_description, data[endIndex].id)

  };

  const updateCard = async (board, cid, data) => {
    try {
      await Axios.patch(`/api/tasks/task/${cid}/`, {
        task_description: data,
        board: board
      })
      fetchData()
    }
    catch (e) {

    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="App" data-theme={theme}>
        <div className="app_outer">
          <div className="app_boards">
            {data.map((item) => (
              <Board
                key={item.id}
                id={item.id}
                name={item.name}
                card={item.tasks}
                setName={setName}
                addCard={addCard}
                removeCard={removeCard}
                removeBoard={removeBoard}
                updateCard={updateCard}
              />
            ))}
            <Editable
              class={"add__board"}
              name={"Add Board"}
              btnName={"Add Board"}
              onSubmit={addBoard}
              placeholder={"Enter Title"}
            />
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}

export default Home;
