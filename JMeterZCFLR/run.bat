@echo off

rem 生成当前日期
set date=%date:~0,4%%date:~5,2%%date:~8,2%
if "%time:~0,2%" lss "10" (set hour=0%time:~1,1%) else (set hour=%time:~0,2%)
set time=%hour%%time:~3,2%%time:~6,2%
set d=%date%%time%
echo current time: %d%

rem 配置地址
set jmxPath="D:\wtt\JMeterZCFLR"
set jmeterPath="C:\apache-jmeter-4.0"

rem 创建日期文件夹
mkdir %jmxPath%\%d%

rem 执行Jmeter
rem call jmeter -JfilePath="%jmxPath%\%d%" -JthreadNum=1 -JrampUp=1 -Jcycles=1 -n -t %jmxPath%\ZCFLRAPI.jmx -l %jmxPath%\result.jtl -e -o %jmxPath%\%d%\Report
call jmeter -JfilePath="%jmxPath%\%d%" -JthreadNum=1 -JrampUp=1 -Jcycles=1 -n -t %jmxPath%\ZCFLRAPI.jmx -l %jmxPath%\result.jtl -e -o %jmxPath%\%d%\Report

rem 生成监听器截图
rem call java -jar %jmeterPath%\lib\ext\CMDRunner.jar --tool Reporter --generate-png %jmxPath%\%d%\ResponseTimesOverTime.png --input-jtl %jmxPath%\%d%\result.jtl --plugin-type ResponseTimesOverTime
rem call java -jar %jmeterPath%\lib\ext\CMDRunner.jar --tool Reporter --generate-png %jmxPath%\%d%\CPUMemory.png --input-jtl %jmxPath%\%d%\CPUMemory.jtl --plugin-type PerfMon

rem 剪切日志
move jmeter.log %jmxPath%\%d%

rem pause