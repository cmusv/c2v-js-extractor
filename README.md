# c2v-js-extractor
code2vec Javascript extractor

# Usage

0. Use correct Node version via [nvm][nvm]

```
> nvm use
```

[nvm]: https://github.com/nvm-sh/nvm

1. Install dependencies

```
> npm i
```

2. Run the extractor

```
> node main.js --input_dir raw_data/ --output_dir --format c2v
```

# Todo

- [ ] All file paths and config values are externalizable via flags
- [ ] Can be run on Windows & Linux & Mac
- [ ] Parallel processing of files
- [ ] Train/test/validation split 
- [ ] Generate both code2vec and code2seq formats
- [ ] Test suite with fixtures
- [ ] Support for customizing target labels