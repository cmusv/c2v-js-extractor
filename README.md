# c2v-js-extractor
code2vec Javascript extractor

# Prepare the environment

1. Use correct Node version via [nvm][nvm]

```
> nvm use
```

[nvm]: https://github.com/nvm-sh/nvm

2. Install dependencies and build the extractor

```
> npm i
> npm run build
```

3. Create python virtual env and install dependencies

```
> python3 -m venv env
> source ./env/bin/activate
> pip install -r requirements.txt
```

4. Prepare code samples under the `raw_code/` directory 

```
> mkdir -p raw_code
> cd raw_code
> git clone https://github.com/axios/axios.git 
> git clone git@github.com:expressjs/express.git
> touch labels.csv
> cd ../
```

TODO: we need to properly generate a `label.csv` file here. If there isn't an entry for a particular function, it will default to `safe` label. 
Currently, all function entries will be `safe`. Take a look at the `fixtures/labels.csv` for an example of how it should look.

# Usage

1. Run the extractor script 

```
> source preprocess.sh
```

Take a look at `output/testing/` for all data files, including intermediate histogram files.

# Running with code2vec

1. Clone the code2vec repo

```
> git clone git@github.com:tech-srl/code2vec.git
> cd code2vec
> pip install -r requirements.txt
```

Take a look at `train.sh` and modify the script variables accordingly. Move the generated data files in `output/testing/*` into the code2vec folder that matches the parameters configured in `train.sh`. In order to run the training run:

```
> source ./train.sh
```


# Labels

The labels are fetched via a `labels.csv` file in the `raw_code` directory. This file needs to be created in the top-level of the directory which holds source code projects.
The format of `labels.csv` just contains code locations and the corresponding labels. For example:

```
project,fpath,sline,scol,eline,ecol,label
test-simple,main.js,3,0,8,1,safe
test-simple,main.js,21,4,21,33,safe
test-simple,main.js,19,2,23,3,xss
```

Row 1 means for project `test-simple` with relative path `main.js` with start line 3, start column 0, end line 8, end column 1, and the label `safe`.
`fpath` should be a relative path from the top-level of the project (ie. `test-simple`).
