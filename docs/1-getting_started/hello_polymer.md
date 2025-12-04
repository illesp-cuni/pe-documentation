# 🧪 Your First Polymer
Welcome to the polymer modeling guide for PE!

Just as every programmer starts with a simple ```"Hello World!"``` program, we are now going to set up your first polymer simulation using PE software. This tutorial will walk you through the key input files and the steps required to generate your first output data.

---------------------------------
##pe.in
This is a necessary file needed for running any simulation. This file and all it's keywords will be discussed in further sections of this documentation. For the purposes of this demonstration we will create one simple chain in simulation box using keywords ``` chain, chain_length, box``` and ```cycles```.

pe.in has a simple structure of a keyword separated from it's value by a space. Knowing this, we will create this simple input file:

pe.in example
------------------------
```bash
chains 1
chain_length 20
box 40
cycles 100
```
Now that we have created the simple input file we can run our first simulation.
