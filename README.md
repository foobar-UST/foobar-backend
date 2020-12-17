# foobar-backends
Foobar++ is a group ordering and delivery application.

## Changelog
See all the changes here [CHANGELOG.md](CHANGELOG.md).

## Functions
Functions | Usages
---------- | --------------

## Deploy
- To deploy all functions
```console
firebase deploy --only functions
```

- To deploy a specific group of functions
```console
firebase deploy --only functions:group_name
```

## Emulator
- To start emulator
```console
firebase emulators:start --import=./emulator --export-on-exit
```

## Disable functions
- To disable functions, simply uncomment them and deploy again to Firebase.
