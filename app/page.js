'use client';

import { Box, Button, Typography, Stack, TextField, Modal } from "@mui/material";
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { collection, deleteDoc, getDoc, getDocs, query, setDoc, doc } from 'firebase/firestore';
import backgroundImage from './pantry.jpeg'; // Ensure the path is correct

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSearch = () => {
    const result = inventory.find(item =>
      item.name.toLowerCase() === searchTerm.toLowerCase()
    );
    setSearchResult(result);
  };

  const handleFindMore = (itemName) => {
    const query = encodeURIComponent(itemName);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
      sx={{
        backgroundImage: `url(${backgroundImage.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <TextField
        variant="outlined"
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" onClick={handleSearch}>
        Search
      </Button>

      {searchResult && (
        <Box
          width="80%"
          bgcolor="#f0f0f0"
          padding={3}
          marginTop={2}
          border="1px solid #333"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5">
            {searchResult.name.charAt(0).toUpperCase() + searchResult.name.slice(1)}
          </Typography>
          <Typography variant="h5">
            Quantity: {searchResult.quantity}
          </Typography>
        </Box>
      )}

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
            transform: "translate(-50%, -50%)",
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
            ></TextField>
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              ADD
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button
        variant="contained"
        onClick={() => {
          handleOpen();
        }}
      >
        Add New Item
      </Button>
      <Box border="1px solid #333">
        <Box
          width="800px"
          height="100px"
          bgcolor="#ADD8E6"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h2" color="#333">
            Inventory Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow="auto">
          {inventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#f0f0f0"
              padding={5}
            >
              <Typography
                variant="h3"
                color="#333"
                textAlign="center"
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography
                variant="h3"
                color="#333"
                textAlign="center"
              >
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
                <Button
                  variant="contained"
                  onClick={() => handleFindMore(name)}
                >
                  Find More
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
