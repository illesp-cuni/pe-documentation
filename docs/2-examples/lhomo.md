# Linear Homopolymer
Here we present the simplest linear homopolymer example.
```bash
%%% uncharged linear homopolymer in a good solvent with a coiled initial conformation

%====== SYSTEM SETTINGS ======
chains 1            % Number of polymer chains
chain_length 100    % Number of beads in the backbone
n_branches 0        % Number of branches
box 200.0           % Size of simulation box

%====== INTERACTION SETTINGS ======
r0 1.0              % Bead distance at the minimum of the harmonic bonding potential
e_bonding 10.0      % Bonding interaction parameter (can be thought of as bond stiffness)
e_nonbonding 1.5    % Non-bonding interaction parameter
theta 0             % Strength of the attractive interaction, 0.2 below theta state

% ====== SIMULATION SETTINGS ======
shoot 3             % How to initialize polymer, for 0 make an extended conformation, otherwise make |shoot| trials, if shoot<0 use only bonding interactions
mx_weight 1.5       % How much randomness (for shoot==0) or persistence (for shoot!=0) to add
job 2               % 1: MD, 2: HMC
order 2             % integrator order 2, 4 or 6
dt 0.3              % integration time-step
n_steps 20          % number of integration steps per one HMC move
precycles 0         % how many cycles to discard from the beginning
cycles 1000         % how many cycles to do afterwards
seed -1             % random seed, <0 for derived from time
check 0             % read checkpoint after initialization for types<check (if check>0 or all for check<0 or skip for check=0)
mangle 0            % overwrite coordinates of the initialized system with pe.mangle for types<mangle (if mangle>0 or all for mangle<0 or skip for mangle=0). pe.mangle has same format as pe.xyz
cpu_timeout -1      % cpu timeout in seconds, <=0 for none
wall_timeout -1     % wall timeout in seconds, <=0 for none

%====== SAVE SETTINGS ======
m_period 1          % how often to write out movie file, 0 no movie, n>0 each n-th frame, n<0 single cooling only
c_period -1         % how often to write out checkpoint file, <1 to turn off
p_period 0          % how often to write out playback file, <1 to turn off
n_period 0          % how often to write out numbers of beads, <1 to turn off
d_period 1          % how often to write out measurements, <1 to turn off
sf_period 0         % how often to write out scattering function, <1 to turn off
m_pbc 0             % movie in PBC

```