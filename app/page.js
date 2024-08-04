"use client";
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
import { getRecipe } from "@/recipe-suggestion";

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [queryName, setQuery] = useState("");
  const [queryText, setQueryText] = useState("Enter Pantry Item");
  const [loading, setLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(false);

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

  const [response, setResponse] = useState("");

  const handleFetchRecipe = async () => {
    setApiLoading(true);
    const recipe = await getRecipe(pantry);
    setResponse(recipe);
    setApiLoading(false);
  };

  useEffect(() => {
    updatePantryWithLoading();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      gap={2}
      flexDirection="column"
      margin={4}
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
              sx={{
                backgroundColor: "aliceblue",
                "&:hover": {
                  backgroundColor: "navy",
                  color: "white",
                },
                color: "black",
              }}
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
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={2}
          flexDirection="column"
        >
          <Box
            border="1px solid #333"
            bgcolor="#b6d7a8"
            width="60vw"
            display="flex"
            padding={1}
            justifyContent="center"
            alignItems="center"
            borderRadius="16px"
          >
            <Typography variant="h2">Pantry Tracker</Typography>
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center">
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
                sx={{
                  backgroundColor: "aliceblue",
                  "&:hover": {
                    backgroundColor: "navy",
                    color: "white",
                  },
                  color: "black",
                }}
                onClick={() => {
                  queryItem(queryName);
                  setQuery("");
                }}
              >
                Search
              </Button>
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Box
              border="1px solid #333"
              sx={{
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
              }}
            >
              <Box
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
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "aliceblue",
                    "&:hover": {
                      backgroundColor: "navy",
                      color: "white",
                    },
                    color: "black",
                  }}
                  onClick={() => {
                    handleOpen();
                  }}
                >
                  Add New Item
                </Button>
              </Box>
              <Stack
                width="60vw"
                height="400px"
                spacing={2}
                overflow="auto"
                display="flex"
                alignItems="center"
              >
                {loading ? (
                  <Box paddingTop={10}>
                    <CircularProgress />
                  </Box>
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
                          sx={{
                            backgroundColor: "aliceblue",
                            "&:hover": {
                              backgroundColor: "navy",
                              color: "white",
                            },
                            color: "black",
                          }}
                          onClick={() => {
                            addItem(name);
                          }}
                        >
                          +
                        </Button>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: "aliceblue",
                            "&:hover": {
                              backgroundColor: "navy",
                              color: "white",
                            },
                            color: "black",
                          }}
                          onClick={() => {
                            removeItem(name);
                          }}
                        >
                          -
                        </Button>
                      </Stack>
                    </Box>
                  ))
                )}
              </Stack>
            </Box>
            <Box>
              <Box gap={2} display="flex" flexDirection="column" margin={5}>
                <Typography variant="h4">AI Personal Chef</Typography>
                {apiLoading ? (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <CircularProgress />
                  </Box>
                ) : (
                  <TextField
                    value={response}
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
                    variant="outlined"
                    multiline
                    style={{
                      maxHeight: "300px",
                      overflowY: "auto",
                    }}
                  />
                )}
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "aliceblue",
                    "&:hover": {
                      backgroundColor: "navy",
                      color: "white",
                    },
                    color: "black",
                  }}
                  onClick={() => {
                    handleFetchRecipe(response);
                  }}
                >
                  Get Recipe Suggestions!
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
