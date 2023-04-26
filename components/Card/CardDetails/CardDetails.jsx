import React, { useState, useEffect } from "react";
import {
  Calendar,
  Check,
  CheckSquare,
  Clock,
  CreditCard,
  List,
  Plus,
  Tag,
  Trash,
  Type,
  X,
} from "react-feather";
import Editable from "../../Editable/Editable";
import Modal from "../../Modal/Modal";
import "./CardDetails.css";
import { v4 as uuidv4 } from "uuid";
import Label from "../../Label/Label";

export default function CardDetails(props) {
  const colors = ["#61bd4f", "#f2d600", "#ff9f1a", "#eb5a46", "#c377e0"];

  const [values, setValues] = useState({ ...props.card });
  const [input, setInput] = useState(false);
  const [text, setText] = useState(values.title);
  const [labelShow, setLabelShow] = useState(false);
  const Input = (props) => {
    return (
      <div className="">
        <input
          autoFocus
          defaultValue={text}
          type={"text"}
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
      </div>
    );
  };
  const addTask = (value) => {
    values.task.push({
      id: uuidv4(),
      task: value,
      completed: false,
    });
    setValues({ ...values });
  };

  const removeTask = (id) => {
    const remaningTask = values.task.filter((item) => item.id !== id);
    setValues({ ...values, task: remaningTask });
  };

  const deleteAllTask = () => {
    setValues({
      ...values,
      task: [],
    });
  };

  const updateTask = (id) => {
    const taskIndex = values.task.findIndex((item) => item.id === id);
    values.task[taskIndex].completed = !values.task[taskIndex].completed;
    setValues({ ...values });
  };
  const updateTitle = (value) => {
    setValues({ ...values, title: value });
  };

  const calculatePercent = () => {
    const totalTask = values.task.length;
    const completedTask = values.task.filter(
      (item) => item.completed === true
    ).length;

    return Math.floor((completedTask * 100) / totalTask) || 0;
  };

  const removeTag = (id) => {
    const tempTag = values.tags.filter((item) => item.id !== id);
    setValues({
      ...values,
      tags: tempTag,
    });
  };

  const addTag = (value, color) => {
    values.tags.push({
      id: uuidv4(),
      tagName: value,
      color: color,
    });

    setValues({ ...values });
  };

  const handelClickListner = (e) => {
    if (e.code === "Enter") {
      setInput(false);
      updateTitle(text === "" ? values.title : text);
    } else return;
  };

  useEffect(() => {
    document.addEventListener("keypress", handelClickListner);
    return () => {
      document.removeEventListener("keypress", handelClickListner);
    };
  });
  useEffect(() => {
    if (props.updateCard) props.updateCard(values.board, values?.id);
  }, [values]);

  const [editData, setEditData] = useState(values.task_description)


  const handleEdit = async (e) => {
    e.preventDefault()
    await props.updateCard(values.board, values.id, editData)
    props.onClose(false)
  }

  return (
    <Modal onClose={props.onClose}>
      <div className="local__bootstrap">
        <form className="w-75 m-auto mt-2 mb-2" onSubmit={handleEdit}>
          <div className="mb-2">
            <label className="form-label">Card name</label>
            <input type="text" required className="form-control" onChange={(e) => setEditData(e.target.value)} value={editData} placeholder="enter card name" />
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-sm w-25 btn-primary">Edit</button>
          </div>
        </form>
        <div
          className="container d-flex justify-content-center my-4"
          style={{ minWidth: "400px" }}
        >
          <button onClick={() => {
            props.removeCard(values.board, values.id),
              props.onClose(false)
          }} className="btn btn-danger">
            <Trash className="" /> Delete Card
          </button>
        </div>
      </div>
    </Modal>
  );
}
