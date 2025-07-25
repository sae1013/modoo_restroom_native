### < 공통 가이드 > 
### 개발테스트
- 빌드 
```
expo prebuild --platform ios --clean
expo prebuild --platform android --clean
```

- 실행
```
expo run:ios --device
expo run:android --device
```

### < AOS >

### 안드로이드 배포용 로컬빌드

1-1 로컬에서 eas build (prd모드)
``` 
eas build --platform android --local --profile production
```

### 빌드전 유의사항
1-2 local.properties 파일에서 아래 안드로이드 sdk 폴더지정(빌드 툴이 들어있음)
```
sdk.dir=/Users/minwoojung/Library/Android/sdk
```
### aab 파일 play console에 업로드


### < IOS >
2-1 로컬에서 eas build (prd모드)
```
eas build --platform ios --local --profile production
```

### IOS 빌드 후 아티팩트 올리는법 (엑스포 -> 테스트플라이트로 자동 submit됨)
2-2 생성된 빌드파일을 테스트플라이트 or 앱스토어에 올리는법
``` 
eas submit \
  --platform ios \
  --profile production \
  --path ./build/MyApp.ipa

```


### 트러블슈팅
- IOS 빌드를 위해서 cocoapods 설치 필수. 
