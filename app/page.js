"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import {
  Box,
  Modal,
  TextField,
  Typography,
  Stack,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  collection,
  getDocs,
  query,
  deleteDoc,
  getDoc,
  doc,
  setDoc,
  Query,
} from "firebase/firestore";

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [queryName, setQuery] = useState("");
  const [queryText, setQueryText] = useState("Enter Pantry Item");
  const [loading, setLoading] = useState(false);

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, "pantry"));
    const docs = await getDocs(snapshot);
    const pantryList = [];
    docs.forEach((doc) => {
      pantryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setPantry(pantryList);
    console.log(pantryList);
  };

  const updatePantryWithLoading = async () => {
    setLoading(true);
    await updatePantry();
    setLoading(false);
  };

  const queryItem = async (item) => {
    if (item === "") {
      updatePantry();
      setQueryText("Please Enter A Pantry Item");
      return;
    } else {
      setQueryText("Enter Pantry Item");
    }
    item = item.toLowerCase();
    const docRef = doc(collection(firestore, "pantry"), item);
    const docSnap = await getDoc(docRef);
    const pantryList = [];

    if (docSnap.exists()) {
      pantryList.push({
        name: docSnap.id,
        ...docSnap.data(),
      });
      setPantry(pantryList);
      console.log(pantryList);
    } else {
      setQueryText("Item Not Found");
      updatePantry();
    }
  };

  const addItem = async (item) => {
    item = item.toLowerCase();
    const docRef = doc(collection(firestore, "pantry"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updatePantry();
  };

  const removeItem = async (item) => {
    item = item.toLowerCase();
    const docRef = doc(collection(firestore, "pantry"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updatePantry();
  };

  useEffect(() => {
    updatePantryWithLoading();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      gap={2}
      flexDirection="column"
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%,-50%)",
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Box>
        <Box
          border="1px solid #333"
          bgcolor="#ebebeb"
          width="80vw"
          display="flex"
          padding={1}
          marginTop={4}
          justifyContent="center"
          alignItems="center"
          borderRadius="16px"
        >
          <Typography variant="h1">Pantry Tracker</Typography>
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={2}
          flexDirection="column"
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            border="1px solid #333"
            gap={2}
            padding={1}
            margin={2}
            flexDirection="row"
          >
            <TextField
              fullWidth
              placeholder="Search..."
              value={queryName}
              helperText={queryText}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
            />
            <Button
              variant="contained"
              onClick={() => {
                queryItem(queryName);
                setQuery("");
              }}
            >
              Search
            </Button>
          </Box>
          <Button
            variant="contained"
            onClick={() => {
              handleOpen();
            }}
          >
            Add New Item
          </Button>
          <Box
            border="1px solid #333"
            sx={{
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
            }}
          >
            <Box
              width="100%"
              minHeight="60px"
              display="grid"
              gridTemplateColumns="2fr 1fr 1fr"
              alignItems="center"
              bgcolor="#b6d7a8"
              padding={2}
              fontWeight="bold"
              sx={{
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
              }}
            >
              <Typography variant="h5" color="#333" textAlign="center">
                Name
              </Typography>
              <Typography variant="h5" color="#333" textAlign="center">
                Quantity
              </Typography>
            </Box>
            <Stack
              paddingTop="80px"
              width="800px"
              height="300px"
              spacing={2}
              overflow="auto"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {loading ? (
                <CircularProgress />
              ) : (
                pantry.map(({ name, quantity }) => (
                  <Box
                    key={name}
                    width="100%"
                    minHeight="60px"
                    display="grid"
                    alignItems="center"
                    gridTemplateColumns="2fr 1fr 1fr"
                    bgcolor="#f0f0f0"
                    borderRadius="16px"
                    padding={2}
                  >
                    <Typography variant="h5" color="#333" textAlign="center">
                      {name.charAt(0).toUpperCase() + name.slice(1)}
                    </Typography>
                    <Typography variant="h5" color="#333" textAlign="center">
                      {quantity}
                    </Typography>
                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="contained"
                        onClick={() => {
                          addItem(name);
                        }}
                      >
                        Add
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => {
                          removeItem(name);
                        }}
                      >
                        Remove
                      </Button>
                    </Stack>
                  </Box>
                ))
              )}
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
