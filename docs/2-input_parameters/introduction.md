# Choosing the correct initialization
Perhaps a single most important parameter for modelling a desired polymer chains in pe is the initialization parameter ```model_type```. This parameter has many values from which we will discuss the most prominent and all around useful ones. These include 

##Simple Polymer System - ```model_type 0``` 
One of the strongest choices for all around polymer modelling would be the default initialization of simple polymer.

***Parameters***


```chains int``` - number of chains in the system

```chain_length int``` - length of a single polymer chain

```n_branches int``` - number of branches on a single polymer chain (if branching is present)

```branch_length int``` - length of a single branch (if branching is present)



4 - Block Copolymer

12 - Protein