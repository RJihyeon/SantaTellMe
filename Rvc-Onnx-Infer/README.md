#### 참고 프로젝트 
    - 상당 부분 [RVC_Onnx_Infer](https://github.com/codename0og/RVC_Onnx_Infer)을 참고해서 만듬
#### 모델 테스트 방법
    -  https://huggingface.co/NaruseMioShirakana/MoeSS-SUBModel/tree/main 여기서 vec-768-layer-12.onnx 또는 vec-768-layer-9.onnx 를 ./assets 에 다운
    - rvc2 모델을 onnx로 변환후 ./assets 에 이동(https://github.com/RVC-Project/Retrieval-based-Voice-Conversion-WebUI 프로젝트에 변환 코드 존재)
    - 테스트 데이터(wav 파일)를 ./sample-data에 다운
    - onnx, wav 파일 이름에 맞게 소스코드 수정. 테스트 코드는 하드코딩이 되어있다. ㅠㅠ




