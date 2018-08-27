/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [1.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "确认完成股东情况"], "isController": false}, {"data": [1.0, 500, 1500, "确认完成实际控制人及持股比例"], "isController": false}, {"data": [1.0, 500, 1500, "上传外部资金方情况标准附件"], "isController": false}, {"data": [1.0, 500, 1500, "上传理财部门整体介绍非标准附件"], "isController": false}, {"data": [1.0, 500, 1500, "录入实际控制人及持股比例"], "isController": false}, {"data": [1.0, 500, 1500, "确认完成对外负债情况"], "isController": false}, {"data": [1.0, 500, 1500, "上传公司组织架构标准附件"], "isController": false}, {"data": [1.0, 500, 1500, "上传产品类别及对应流程图、简介非标准附件"], "isController": false}, {"data": [1.0, 500, 1500, "上传主要部门负责人及简介标准附件"], "isController": false}, {"data": [1.0, 500, 1500, "上传股权结构非标准附件"], "isController": false}, {"data": [1.0, 500, 1500, "上传股东情况标准附件"], "isController": false}, {"data": [1.0, 500, 1500, "确认完成非标准附件(业务信息)"], "isController": false}, {"data": [1.0, 500, 1500, "确认完成外部资金方情况"], "isController": false}, {"data": [1.0, 500, 1500, "状态显示"], "isController": false}, {"data": [1.0, 500, 1500, "上传人法、仲裁、失信情况标准附件"], "isController": false}, {"data": [1.0, 500, 1500, "上传关联公司标准附件"], "isController": false}, {"data": [1.0, 500, 1500, "上传产品大纲、盈利逻辑分析及具体收费标准非标准附件"], "isController": false}, {"data": [1.0, 500, 1500, "上传公司简介非标准附件"], "isController": false}, {"data": [1.0, 500, 1500, "上传业务模式、市场定位分析、主营业务竞争优势非标准附件"], "isController": false}, {"data": [1.0, 500, 1500, "上传风控部门设置、风控业务操作流程、制度规定、授信规则非标准附件"], "isController": false}, {"data": [1.0, 500, 1500, "确认完成业务总量概况"], "isController": false}, {"data": [1.0, 500, 1500, "上传业务地域分布情况标准附件"], "isController": false}, {"data": [1.0, 500, 1500, "确认完成近一年有息负债融资清单及相应的协议"], "isController": false}, {"data": [1.0, 500, 1500, "确认完成关联公司"], "isController": false}, {"data": [1.0, 500, 1500, "确认完成公司各月募资情况线下"], "isController": false}, {"data": [1.0, 500, 1500, "上传关联方股权结构图非标准附件"], "isController": false}, {"data": [1.0, 500, 1500, "确认完成公司各月募资情况线上"], "isController": false}, {"data": [1.0, 500, 1500, "上传渠道、业务人员返点制度非标准附件"], "isController": false}, {"data": [1.0, 500, 1500, "确认完成外部融资渠道最近一年的融资台账"], "isController": false}, {"data": [1.0, 500, 1500, "上传Top5资金方协议非标准附件"], "isController": false}, {"data": [1.0, 500, 1500, "确认完成理财部门整体介绍"], "isController": false}, {"data": [1.0, 500, 1500, "确认完成最近一期公司银行、第三方支付账户列表与余额并提供相应的银行对账单"], "isController": false}, {"data": [1.0, 500, 1500, "确认完成尽调情况"], "isController": false}, {"data": [1.0, 500, 1500, "登录"], "isController": false}, {"data": [1.0, 500, 1500, "上传营业执照非标准附件"], "isController": false}, {"data": [1.0, 500, 1500, "确认完成商务部初审意见"], "isController": false}, {"data": [1.0, 500, 1500, "录入尽调信息"], "isController": false}, {"data": [1.0, 500, 1500, "上传实际控制人、法定代表人身份证、个人征信报告相关信息非标准附件"], "isController": false}, {"data": [1.0, 500, 1500, "上传业务总量概况标准附件"], "isController": false}, {"data": [1.0, 500, 1500, "确认完成企业基本情况"], "isController": false}, {"data": [1.0, 500, 1500, "确认完成对外担保情况"], "isController": false}, {"data": [1.0, 500, 1500, "确认完成业务门店分布情况"], "isController": false}, {"data": [1.0, 500, 1500, "确认完成非标准附件(风控部门资料)"], "isController": false}, {"data": [1.0, 500, 1500, "上传验资报告非标准附件"], "isController": false}, {"data": [1.0, 500, 1500, "上传近一年有息负债融资清单及相应的协议标准附件"], "isController": false}, {"data": [1.0, 500, 1500, "上传公司募资余额产品结构情况标准附件线上"], "isController": false}, {"data": [1.0, 500, 1500, "录入企业工商信息"], "isController": false}, {"data": [1.0, 500, 1500, "上传公司募资余额产品结构情况标准附件线下"], "isController": false}, {"data": [1.0, 500, 1500, "上传公司各月募资情况标准附件线下"], "isController": false}, {"data": [1.0, 500, 1500, "上传公司各月募资情况标准附件线上"], "isController": false}, {"data": [1.0, 500, 1500, "确认完成人法、仲裁、失信情况"], "isController": false}, {"data": [1.0, 500, 1500, "上传外部融资渠道最近一年的融资台账标准附件"], "isController": false}, {"data": [1.0, 500, 1500, "确认完成主要部门负责人及简介"], "isController": false}, {"data": [1.0, 500, 1500, "上传客户进件资料与合同非标准附件"], "isController": false}, {"data": [1.0, 500, 1500, "上传业务门店分布情况标准附件"], "isController": false}, {"data": [1.0, 500, 1500, "上传近一年每月代偿台账非标准附件"], "isController": false}, {"data": [1.0, 500, 1500, "上传客户、经销商、门店准入及筛选标准非标准附件"], "isController": false}, {"data": [1.0, 500, 1500, "上传最近一期公司银行、第三方支付账户列表与余额并提供相应的银行对账单标准附件"], "isController": false}, {"data": [1.0, 500, 1500, "确认完成公司组织架构"], "isController": false}, {"data": [1.0, 500, 1500, "确认完成企业工商信息"], "isController": false}, {"data": [1.0, 500, 1500, "确认完成非标准附件(财务信息)"], "isController": false}, {"data": [1.0, 500, 1500, "确认完成公司募资余额产品结构情况线下"], "isController": false}, {"data": [1.0, 500, 1500, "录入企业基本情况"], "isController": false}, {"data": [1.0, 500, 1500, "上传对外负债情况标准附件"], "isController": false}, {"data": [1.0, 500, 1500, "确认完成融资情况"], "isController": false}, {"data": [1.0, 500, 1500, "录入商务部初审意见"], "isController": false}, {"data": [1.0, 500, 1500, "上传公司未来发展计划非标准附件"], "isController": false}, {"data": [1.0, 500, 1500, "创建资产方"], "isController": false}, {"data": [1.0, 500, 1500, "确认完成公司募资余额产品结构情况线上"], "isController": false}, {"data": [1.0, 500, 1500, "确认完成业务地域分布情况"], "isController": false}, {"data": [1.0, 500, 1500, "提交审批"], "isController": false}, {"data": [1.0, 500, 1500, "上传拒单规则、近一年每月的拒单笔数与触碰的规则非标准附件"], "isController": false}, {"data": [1.0, 500, 1500, "上传对外担保情况标准附件"], "isController": false}, {"data": [1.0, 500, 1500, "上传近三年审计报告、咨询报告非标准附件"], "isController": false}, {"data": [1.0, 500, 1500, "上传公司股东、高级管理人员简历非标准附件"], "isController": false}, {"data": [1.0, 500, 1500, "上传融资情况标准附件"], "isController": false}, {"data": [1.0, 500, 1500, "提交风控"], "isController": false}, {"data": [1.0, 500, 1500, "上传公司章程非标准附件"], "isController": false}, {"data": [1.0, 500, 1500, "查询资产方ZC0554"], "isController": false}, {"data": [1.0, 500, 1500, "上传两年一期末级科目余额表非标准附件"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 80, 0, 0.0, 242.43749999999991, 187, 475, 273.70000000000005, 294.30000000000007, 475.0, 1.1600087000652506, 0.8293099307619807, 1.112699263213224], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["确认完成股东情况", 1, 0, 0.0, 192.0, 192, 192, 192.0, 192.0, 192.0, 5.208333333333333, 3.606160481770833, 3.9825439453125], "isController": false}, {"data": ["确认完成实际控制人及持股比例", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 4.587155963302752, 3.1760679472477062, 3.4851634174311927], "isController": false}, {"data": ["上传外部资金方情况标准附件", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 3.717472118959108, 2.5811744888475836, 6.29501626394052], "isController": false}, {"data": ["上传理财部门整体介绍非标准附件", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 3.937007874015748, 2.7336060531496065, 3.8562684547244093], "isController": false}, {"data": ["录入实际控制人及持股比例", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 4.016064257028112, 2.7806538654618476, 3.3336470883534135], "isController": false}, {"data": ["确认完成对外负债情况", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 5.291005291005291, 3.6944031084656084, 4.056092923280423], "isController": false}, {"data": ["上传公司组织架构标准附件", 1, 0, 0.0, 281.0, 281, 281, 281.0, 281.0, 281.0, 3.558718861209964, 2.470946396797153, 4.219028024911031], "isController": false}, {"data": ["上传产品类别及对应流程图、简介非标准附件", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 3.937007874015748, 2.7259165846456694, 3.867802657480315], "isController": false}, {"data": ["上传主要部门负责人及简介标准附件", 1, 0, 0.0, 270.0, 270, 270, 270.0, 270.0, 270.0, 3.7037037037037037, 2.5643807870370368, 3.8230613425925926], "isController": false}, {"data": ["上传股权结构非标准附件", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 3.9215686274509802, 2.738204656862745, 3.6266850490196076], "isController": false}, {"data": ["上传股东情况标准附件", 1, 0, 0.0, 271.0, 271, 271, 271.0, 271.0, 271.0, 3.6900369003690034, 2.554918127306273, 4.518853782287823], "isController": false}, {"data": ["确认完成非标准附件(业务信息)", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 4.032258064516129, 2.783990675403226, 3.063571068548387], "isController": false}, {"data": ["确认完成外部资金方情况", 1, 0, 0.0, 198.0, 198, 198, 198.0, 198.0, 198.0, 5.050505050505051, 3.4968828914141414, 3.90625], "isController": false}, {"data": ["状态显示", 1, 0, 0.0, 295.0, 295, 295, 295.0, 295.0, 295.0, 3.389830508474576, 7.1371822033898304, 2.0259533898305087], "isController": false}, {"data": ["上传人法、仲裁、失信情况标准附件", 1, 0, 0.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 3.90625, 2.712249755859375, 3.9215087890625], "isController": false}, {"data": ["上传关联公司标准附件", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 3.875968992248062, 2.6760840600775193, 3.6867126937984493], "isController": false}, {"data": ["上传产品大纲、盈利逻辑分析及具体收费标准非标准附件", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 3.937007874015748, 2.7336060531496065, 3.9639210137795273], "isController": false}, {"data": ["上传公司简介非标准附件", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 4.048582995951417, 2.803169281376518, 3.7520559210526314], "isController": false}, {"data": ["上传业务模式、市场定位分析、主营业务竞争优势非标准附件", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 4.237288135593221, 2.9338254766949152, 4.320047669491526], "isController": false}, {"data": ["上传风控部门设置、风控业务操作流程、制度规定、授信规则非标准附件", 1, 0, 0.0, 275.0, 275, 275, 275.0, 275.0, 275.0, 3.6363636363636362, 2.524857954545454, 3.781960227272727], "isController": false}, {"data": ["确认完成业务总量概况", 1, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 4.545454545454545, 3.1383167613636362, 3.4978693181818183], "isController": false}, {"data": ["上传业务地域分布情况标准附件", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 4.132231404958678, 2.861086002066116, 5.7907735020661155], "isController": false}, {"data": ["确认完成近一年有息负债融资清单及相应的协议", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 5.319148936170213, 3.6724983377659575, 4.1400016622340425], "isController": false}, {"data": ["确认完成关联公司", 1, 0, 0.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 4.975124378109452, 3.434973569651741, 3.813938121890547], "isController": false}, {"data": ["确认完成公司各月募资情况线下", 1, 0, 0.0, 208.0, 208, 208, 208.0, 208.0, 208.0, 4.807692307692308, 3.319373497596154, 3.7982647235576925], "isController": false}, {"data": ["上传关联方股权结构图非标准附件", 1, 0, 0.0, 275.0, 275, 275, 275.0, 275.0, 275.0, 3.6363636363636362, 2.5106534090909087, 3.497869318181818], "isController": false}, {"data": ["确认完成公司各月募资情况线上", 1, 0, 0.0, 193.0, 193, 193, 193.0, 193.0, 193.0, 5.181347150259067, 3.587475712435233, 4.09346664507772], "isController": false}, {"data": ["上传渠道、业务人员返点制度非标准附件", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 4.291845493562231, 2.979982564377682, 4.140960300429184], "isController": false}, {"data": ["确认完成外部融资渠道最近一年的融资台账", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 5.291005291005291, 3.663401124338624, 4.112929894179894], "isController": false}, {"data": ["上传Top5资金方协议非标准附件", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 4.032258064516129, 2.815492691532258, 3.8196194556451615], "isController": false}, {"data": ["确认完成理财部门整体介绍", 1, 0, 0.0, 192.0, 192, 192, 192.0, 192.0, 192.0, 5.208333333333333, 3.5959879557291665, 3.972371419270833], "isController": false}, {"data": ["确认完成最近一期公司银行、第三方支付账户列表与余额并提供相应的银行对账单", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 5.319148936170213, 3.6724983377659575, 4.036112034574468], "isController": false}, {"data": ["确认完成尽调情况", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 4.219409282700422, 2.9132054324894514, 3.2057621308016877], "isController": false}, {"data": ["登录", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 2.3640661938534278, 1.7014812352245863, 0.8495862884160756], "isController": false}, {"data": ["上传营业执照非标准附件", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 3.937007874015748, 2.7259165846456694, 3.640963336614173], "isController": false}, {"data": ["确认完成商务部初审意见", 1, 0, 0.0, 212.0, 212, 212, 212.0, 212.0, 212.0, 4.716981132075471, 3.265956662735849, 3.5838001179245285], "isController": false}, {"data": ["录入尽调信息", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 3.968253968253968, 2.7553013392857144, 3.642733134920635], "isController": false}, {"data": ["上传实际控制人、法定代表人身份证、个人征信报告相关信息非标准附件", 1, 0, 0.0, 243.0, 243, 243, 243.0, 243.0, 243.0, 4.11522633744856, 2.857349537037037, 4.320183899176955], "isController": false}, {"data": ["上传业务总量概况标准附件", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 3.8314176245210727, 2.652807710727969, 5.604944923371647], "isController": false}, {"data": ["确认完成企业基本情况", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 5.291005291005291, 3.663401124338624, 4.009589947089947], "isController": false}, {"data": ["确认完成对外担保情况", 1, 0, 0.0, 193.0, 193, 193, 193.0, 193.0, 193.0, 5.181347150259067, 3.587475712435233, 3.9568490932642484], "isController": false}, {"data": ["确认完成业务门店分布情况", 1, 0, 0.0, 196.0, 196, 196, 196.0, 196.0, 196.0, 5.1020408163265305, 3.5624601403061225, 3.886320153061224], "isController": false}, {"data": ["确认完成非标准附件(风控部门资料)", 1, 0, 0.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 4.975124378109452, 3.434973569651741, 3.7993625621890543], "isController": false}, {"data": ["上传验资报告非标准附件", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 4.016064257028112, 2.7806538654618476, 3.7572163654618476], "isController": false}, {"data": ["上传近一年有息负债融资清单及相应的协议标准附件", 1, 0, 0.0, 251.0, 251, 251, 251.0, 251.0, 251.0, 3.9840637450199203, 2.7507158864541834, 4.972298306772909], "isController": false}, {"data": ["上传公司募资余额产品结构情况标准附件线上", 1, 0, 0.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 3.90625, 2.712249755859375, 4.848480224609375], "isController": false}, {"data": ["录入企业工商信息", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 4.081632653061225, 2.849968112244898, 5.189732142857143], "isController": false}, {"data": ["上传公司募资余额产品结构情况标准附件线下", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 3.802281368821293, 2.625207937262357, 4.71943322243346], "isController": false}, {"data": ["上传公司各月募资情况标准附件线下", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 4.0, 2.79296875, 7.171875], "isController": false}, {"data": ["上传公司各月募资情况标准附件线上", 1, 0, 0.0, 243.0, 243, 243, 243.0, 243.0, 243.0, 4.11522633744856, 2.857349537037037, 7.362397119341564], "isController": false}, {"data": ["确认完成人法、仲裁、失信情况", 1, 0, 0.0, 187.0, 187, 187, 187.0, 187.0, 187.0, 5.347593582887701, 3.7130264037433154, 4.099473596256685], "isController": false}, {"data": ["上传外部融资渠道最近一年的融资台账标准附件", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 3.8314176245210727, 2.660290948275862, 4.744372605363984], "isController": false}, {"data": ["确认完成主要部门负责人及简介", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 5.319148936170213, 3.682887300531915, 4.06727892287234], "isController": false}, {"data": ["上传客户进件资料与合同非标准附件", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 4.25531914893617, 2.946309840425532, 4.068317819148937], "isController": false}, {"data": ["上传业务门店分布情况标准附件", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 4.0983606557377055, 2.853643698770492, 4.938844774590164], "isController": false}, {"data": ["上传近一年每月代偿台账非标准附件", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 4.273504273504274, 2.9505542200854697, 4.077357104700854], "isController": false}, {"data": ["上传客户、经销商、门店准入及筛选标准非标准附件", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 4.132231404958678, 2.853015237603306, 4.132231404958678], "isController": false}, {"data": ["上传最近一期公司银行、第三方支付账户列表与余额并提供相应的银行对账单标准附件", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 4.0, 2.77734375, 4.94921875], "isController": false}, {"data": ["确认完成公司组织架构", 1, 0, 0.0, 191.0, 191, 191, 191.0, 191.0, 191.0, 5.235602094240838, 3.625040903141361, 4.0698625654450264], "isController": false}, {"data": ["确认完成企业工商信息", 1, 0, 0.0, 208.0, 208, 208, 208.0, 208.0, 208.0, 4.807692307692308, 3.3287635216346154, 3.648024338942308], "isController": false}, {"data": ["确认完成非标准附件(财务信息)", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 4.291845493562231, 2.9967475858369097, 3.2649879291845494], "isController": false}, {"data": ["确认完成公司募资余额产品结构情况线下", 1, 0, 0.0, 194.0, 194, 194, 194.0, 194.0, 194.0, 5.154639175257732, 3.568983569587629, 4.01196037371134], "isController": false}, {"data": ["录入企业基本情况", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 3.8910505836575875, 2.7016962548638133, 4.290035262645914], "isController": false}, {"data": ["上传对外负债情况标准附件", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 3.8910505836575875, 2.7016962548638133, 4.833414396887159], "isController": false}, {"data": ["确认完成融资情况", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 5.263157894736842, 3.6543996710526314, 4.029605263157895], "isController": false}, {"data": ["录入商务部初审意见", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 4.016064257028112, 2.7884977409638556, 4.388648343373494], "isController": false}, {"data": ["上传公司未来发展计划非标准附件", 1, 0, 0.0, 243.0, 243, 243, 243.0, 243.0, 243.0, 4.11522633744856, 2.849311985596708, 3.9504565329218106], "isController": false}, {"data": ["创建资产方", 1, 0, 0.0, 223.0, 223, 223, 223.0, 223.0, 223.0, 4.484304932735426, 3.179302130044843, 3.0523052130044843], "isController": false}, {"data": ["确认完成公司募资余额产品结构情况线上", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 5.319148936170213, 3.682887300531915, 4.129612699468085], "isController": false}, {"data": ["确认完成业务地域分布情况", 1, 0, 0.0, 204.0, 204, 204, 204.0, 204.0, 204.0, 4.901960784313726, 3.3844592524509807, 3.7530637254901964], "isController": false}, {"data": ["提交审批", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 2.1321961620469083, 1.480460421108742, 1.355527052238806], "isController": false}, {"data": ["上传拒单规则、近一年每月的拒单笔数与触碰的规则非标准附件", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 4.237288135593221, 2.9503773834745766, 4.320047669491526], "isController": false}, {"data": ["上传对外担保情况标准附件", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 3.8910505836575875, 2.6864968385214008, 4.29763497081712], "isController": false}, {"data": ["上传近三年审计报告、咨询报告非标准附件", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 4.166666666666667, 2.8767903645833335, 4.044596354166667], "isController": false}, {"data": ["上传公司股东、高级管理人员简历非标准附件", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 3.9215686274509802, 2.7152267156862746, 3.864123774509804], "isController": false}, {"data": ["上传融资情况标准附件", 1, 0, 0.0, 274.0, 274, 274, 274.0, 274.0, 274.0, 3.6496350364963503, 2.519816377737226, 5.110914689781022], "isController": false}, {"data": ["提交风控", 1, 0, 0.0, 475.0, 475, 475, 475.0, 475.0, 475.0, 2.1052631578947367, 1.4576480263157896, 2.212171052631579], "isController": false}, {"data": ["上传公司章程非标准附件", 1, 0, 0.0, 251.0, 251, 251, 251.0, 251.0, 251.0, 3.9840637450199203, 2.758497260956175, 3.735059760956175], "isController": false}, {"data": ["查询资产方ZC0554", 1, 0, 0.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 3.90625, 3.864288330078125, 2.288818359375], "isController": false}, {"data": ["上传两年一期末级科目余额表非标准附件", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 4.166666666666667, 2.884928385416667, 4.048665364583334], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 80, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
