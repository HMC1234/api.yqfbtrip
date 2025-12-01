// 接口定义和表单配置
const interfaceDefinitions = {
    'BizApi.OpenAPI.Shopping.EasyShopping_V2': {
        name: '查询航班',
        fields: [
            {
                name: 'Routings',
                label: '行程路线',
                type: 'array',
                required: true,
                description: '查询行程路线列表',
                fields: [
                    { name: 'Departure', label: '出发地', type: 'text', required: true, placeholder: '例如: CAN', description: '机场三字码' },
                    { name: 'Arrival', label: '目的地', type: 'text', required: true, placeholder: '例如: PEK', description: '机场三字码' },
                    { name: 'DepartureDate', label: '出发日期', type: 'date', required: true, description: '格式: YYYY-MM-DD' },
                    { name: 'DepartureType', label: '出发地类型', type: 'number', required: true, default: 1, description: '1:机场，默认1' },
                    { name: 'ArrivalType', label: '目的地类型', type: 'number', required: true, default: 1, description: '1:机场，默认1' }
                ]
            },
            {
                name: 'OfficeIds',
                label: '注册公司',
                type: 'array',
                required: true,
                description: '注册公司代码列表',
                itemType: 'text',
                placeholder: '例如: EI00D'
            },
            {
                name: 'Type',
                label: '机票类型',
                type: 'select',
                required: true,
                description: 'A:国际机票，B:国内机票',
                options: [
                    { value: 'A', label: 'A - 国际机票' },
                    { value: 'B', label: 'B - 国内机票' }
                ]
            },
            {
                name: 'Passengers',
                label: '旅客列表',
                type: 'array',
                required: false,
                description: '旅客信息列表',
                fields: [
                    { name: 'PassengerType', label: '旅客类型', type: 'select', required: true, options: [
                        { value: 'ADT', label: 'ADT - 成人' },
                        { value: 'CHD', label: 'CHD - 儿童' },
                        { value: 'INF', label: 'INF - 婴儿' },
                        { value: 'STU', label: 'STU - 学生' }
                    ]}
                ]
            },
            { name: 'BerthType', label: '舱位等级', type: 'select', required: false, description: 'Y:经济舱，C:公务舱，F:头等舱', options: [
                { value: 'Y', label: 'Y - 经济舱' },
                { value: 'C', label: 'C - 公务舱' },
                { value: 'F', label: 'F - 头等舱' }
            ]},
            { name: 'Airlines', label: '指定航司', type: 'array', required: false, description: '指定航空公司代码列表', itemType: 'text', placeholder: '例如: CZ' },
            { name: 'OnlyDirectFlight', label: '仅直飞', type: 'checkbox', required: false, default: false },
            { name: 'IsQueryAirport', label: '查询机场信息', type: 'checkbox', required: false, default: false },
            { name: 'IsQueryEquipment', label: '查询机型信息', type: 'checkbox', required: false, default: false },
            { name: 'IsQueryAirline', label: '查询航司信息', type: 'checkbox', required: false, default: false },
            { name: 'IsQueryRule', label: '查询退改签条款', type: 'checkbox', required: false, default: false },
            { name: 'IsQueryHappyRoute', label: '查询舒适度', type: 'checkbox', required: false, default: false },
            { name: 'IsBrand', label: '品牌模式', type: 'checkbox', required: false, default: false },
            { name: 'IsOnBusiness', label: '是否因公', type: 'checkbox', required: false, default: true, description: 'true:因公，false:因私' },
            { name: 'Currency', label: '货币', type: 'text', required: false, default: 'CNY', description: '转换货币，默认CNY' },
            { name: 'Language', label: '语言', type: 'select', required: false, default: 'ZH-CN', options: [
                { value: 'ZH-CN', label: 'ZH-CN - 简体中文' },
                { value: 'EN-US', label: 'EN-US - 英文' }
            ]},
            { name: 'ChildQty', label: '儿童数量', type: 'number', required: false, default: 0 },
            { name: 'CodeShare', label: '代码共享', type: 'checkbox', required: false, default: false }
        ]
    },
    'BizApi.OpenAPI.Dest.GetAirportList': {
        name: '获取机场列表',
        fields: [
            { name: 'CountryCode', label: '国家代码', type: 'text', required: true, placeholder: '例如: CN', description: '国家2字编码（中国：CN，新加坡：SG等）' }
        ]
    },
    'BizApi.AirTickets.Shopping.VerifyPriceServing': {
        name: '验价接口',
        fields: [
            { name: 'OfficeIds', label: '注册公司', type: 'array', required: true, itemType: 'text', placeholder: '例如: EI00D' },
            { name: 'Agency', label: '数据源', type: 'text', required: true, placeholder: '例如: 1E' },
            { name: 'FQKey', label: 'FQKey', type: 'text', required: true, description: '从 Shopping 接口获取的 Journey-FQKey' },
            { name: 'PlatingCarrier', label: '出票航司', type: 'text', required: true, placeholder: '例如: CZ' },
            { name: 'ABFareId', label: 'ABFareId', type: 'text', required: false, description: '从 Shopping 接口获取的 Fare-ABFareId' },
            { name: 'JourneyCode', label: 'JourneyCode', type: 'text', required: false, description: '从 Shopping 接口获取的 Journey-JourneyCode' },
            { name: 'IsVerifyCabin', label: '是否验舱', type: 'checkbox', required: false, default: true },
            { name: 'IsVerifyPricing', label: '是否验价', type: 'checkbox', required: false, default: true },
            { name: 'Currency', label: '货币', type: 'text', required: false, default: 'CNY' },
            {
                name: 'Passengers',
                label: '旅客列表',
                type: 'array',
                required: false,
                fields: [
                    { name: 'PassengerType', label: '旅客类型', type: 'select', required: true, options: [
                        { value: 'ADT', label: 'ADT - 成人' },
                        { value: 'CHD', label: 'CHD - 儿童' }
                    ]}
                ]
            },
            {
                name: 'Segments',
                label: '航段列表',
                type: 'array',
                required: false,
                fields: [
                    {
                        name: 'Legs',
                        label: '航段详情',
                        type: 'array',
                        required: true,
                        fields: [
                            { name: 'Departure', label: '出发地', type: 'text', required: true },
                            { name: 'Arrival', label: '目的地', type: 'text', required: true },
                            { name: 'DepartureDate', label: '出发时间', type: 'datetime-local', required: true },
                            { name: 'ArrivalDate', label: '到达时间', type: 'datetime-local', required: true },
                            { name: 'Airline', label: '航司', type: 'text', required: true },
                            { name: 'FlightNumber', label: '航班号', type: 'text', required: true },
                            { name: 'Cabin', label: '舱位', type: 'text', required: true },
                            { name: 'FareBasis', label: '票价基础', type: 'text', required: false }
                        ]
                    }
                ]
            }
        ]
    },
    'BizApi.OpenAPI.Easy.AICreateOrder': {
        name: '创建订单',
        fields: [
            { name: 'SourceTypeID', label: '来源ID', type: 'number', required: true, default: 1 },
            { name: 'PaymentMethodID', label: '支付方式', type: 'select', required: true, options: [
                { value: 1, label: '1 - 现付' },
                { value: 3, label: '3 - 欠款' },
                { value: 5, label: '5 - 月结' }
            ]},
            { name: 'SettlementTypeID', label: '结算类型', type: 'number', required: true, default: 11, description: '11:网上支付' },
            {
                name: 'Products',
                label: '产品单信息',
                type: 'array',
                required: true,
                fields: [
                    { name: 'ProductCategoryID', label: '产品类型', type: 'select', required: true, options: [
                        { value: 8, label: '8 - 国内机票' },
                        { value: 9, label: '9 - 国际机票' },
                        { value: 2, label: '2 - 酒店' }
                    ]},
                    { name: 'GDSCode', label: 'GDS编码', type: 'text', required: true, default: '1E' },
                    { name: 'PublicAmount', label: '公开金额', type: 'number', required: false },
                    { name: 'PrivateAmount', label: '私有金额', type: 'number', required: false },
                    {
                        name: 'Air',
                        label: '机票信息',
                        type: 'object',
                        required: false,
                        fields: [
                            { name: 'FQKey', label: 'FQKey', type: 'text', required: true, description: '从验价接口获取的FQKey' },
                            { name: 'TripType', label: '行程类型', type: 'number', required: false, default: 1 }
                        ]
                    }
                ]
            },
            {
                name: 'Passengers',
                label: '旅客信息',
                type: 'array',
                required: true,
                fields: [
                    { name: 'LastName', label: '姓', type: 'text', required: true },
                    { name: 'FirstName', label: '名', type: 'text', required: true },
                    { name: 'PassengerTypeCode', label: '旅客类型', type: 'select', required: true, options: [
                        { value: 'ADT', label: 'ADT - 成人' },
                        { value: 'CHD', label: 'CHD - 儿童' }
                    ]},
                    { name: 'Gender', label: '性别', type: 'select', required: false, options: [
                        { value: 'M', label: 'M - 男' },
                        { value: 'F', label: 'F - 女' }
                    ]},
                    { name: 'CertTypeCode', label: '证件类型', type: 'select', required: true, options: [
                        { value: 'ID', label: 'ID - 身份证' },
                        { value: 'PP', label: 'PP - 护照' }
                    ]},
                    { name: 'CertNr', label: '证件号码', type: 'text', required: true },
                    { name: 'Birthday', label: '生日', type: 'date', required: false, description: '使用护照等非身份证时必填' },
                    { name: 'CertValid', label: '证件有效期', type: 'date', required: false, description: '使用护照等非身份证时必填' },
                    { name: 'Mobile', label: '手机号', type: 'text', required: false }
                ]
            },
            {
                name: 'ContactInfo',
                label: '联系人信息',
                type: 'object',
                required: true,
                fields: [
                    { name: 'Name', label: '联系人姓名', type: 'text', required: true },
                    { name: 'Mobile', label: '联系人手机', type: 'text', required: true },
                    { name: 'Email', label: '邮箱', type: 'email', required: false }
                ]
            }
        ]
    },
    'BizApi.OpenAPI.SubmitOrder': {
        name: '提交订单',
        fields: [
            { name: 'SubmitType', label: '订单类型', type: 'select', required: true, options: [
                { value: 1, label: '1 - 原始单' },
                { value: 2, label: '2 - 改签单' },
                { value: 4, label: '4 - 退票单' }
            ]},
            { name: 'OriginalOrderNo', label: '一起飞原始订单号', type: 'text', required: true, placeholder: '例如: PA20251118001' },
            { name: 'SubmitRemark', label: '提交备注', type: 'text', required: false },
            { name: 'ExternalOrderNo', label: '外部订单号', type: 'text', required: false }
        ]
    },
    'BizApi.OpenAPI.Shopping.VerifyCabin': {
        name: '验舱并补位',
        fields: [
            { name: 'OrderNo', label: '产品单号', type: 'text', required: true, placeholder: '例如: PA20251118001' },
            { name: 'PNR', label: 'PNR编号', type: 'text', required: true, placeholder: '例如: ABC123' },
            { name: 'TicketNumber_Before', label: '原始票号', type: 'text', required: false, description: '改签单验价必填' },
            { name: 'IsVerifyCabin', label: '是否验舱', type: 'checkbox', required: false, default: true },
            { name: 'IsBooking', label: '是否补位', type: 'checkbox', required: false, default: false }
        ]
    },
    'BizApi.OpenAPI.GetOrderList': {
        name: '获取订单列表',
        fields: [
            { name: 'StartDate', label: '开始时间', type: 'date', required: false, description: '查询时间范围' },
            { name: 'EndDate', label: '结束时间', type: 'date', required: false },
            { name: 'ProductCategoryIDs', label: '产品类型ID', type: 'text', required: false, placeholder: '例如: 8,9', description: '多个用英文逗号隔开' },
            { name: 'OrderNos', label: '产品单号', type: 'text', required: false, placeholder: '例如: PA20251118001', description: '多个用英文逗号隔开' },
            { name: 'PageCount', label: '页码', type: 'number', required: false, default: 1, description: '从1开始' },
            { name: 'PageSize', label: '每页显示条数', type: 'number', required: false, default: 20 }
        ]
    }
};

let currentInterface = null;

// 加载接口表单
function loadInterfaceForm() {
    const method = document.getElementById('apiMethod').value;
    const formContainer = document.getElementById('interfaceForm');
    const submitBtn = document.getElementById('submitBtn');
    
    if (!method) {
        formContainer.innerHTML = '';
        submitBtn.disabled = true;
        return;
    }
    
    currentInterface = interfaceDefinitions[method];
    if (!currentInterface) {
        formContainer.innerHTML = '<div class="error-message">接口定义未找到: ' + method + '</div>';
        submitBtn.disabled = true;
        return;
    }
    
    formContainer.innerHTML = '';
    
    // 渲染表单字段
    try {
        currentInterface.fields.forEach(field => {
            const fieldElement = renderField(field, '');
            formContainer.appendChild(fieldElement);
        });
        submitBtn.disabled = false;
    } catch (error) {
        console.error('Error rendering form:', error);
        formContainer.innerHTML = '<div class="error-message">表单渲染错误: ' + error.message + '</div>';
        submitBtn.disabled = true;
    }
}

// 渲染字段
function renderField(field, prefix) {
    const group = document.createElement('div');
    group.className = 'form-group';
    
    const label = document.createElement('label');
    label.innerHTML = field.label + (field.required ? '<span class="field-required">*</span>' : '');
    group.appendChild(label);
    
    if (field.description) {
        const info = document.createElement('div');
        info.className = 'field-info';
        info.textContent = field.description;
        group.appendChild(info);
    }
    
    let input;
    
    if (field.type === 'array') {
        const arrayContainer = document.createElement('div');
        arrayContainer.id = `${prefix}${field.name}_container`;
        arrayContainer.className = 'array-container';
        
        const addBtn = document.createElement('button');
        addBtn.type = 'button';
        addBtn.className = 'btn-add';
        addBtn.textContent = `+ 添加${field.label}`;
        addBtn.onclick = () => addArrayItem(field, prefix);
        
        arrayContainer.appendChild(addBtn);
        group.appendChild(arrayContainer);
        
        // 添加一个初始项
        if (field.required) {
            addArrayItem(field, prefix);
        }
    } else if (field.type === 'object') {
        const objectContainer = document.createElement('div');
        objectContainer.className = 'nested-field';
        
        field.fields.forEach(subField => {
            const subFieldElement = renderField(subField, `${prefix}${field.name}.`);
            objectContainer.appendChild(subFieldElement);
        });
        
        group.appendChild(objectContainer);
    } else {
        input = createInput(field, prefix);
        if (input) {
            group.appendChild(input);
        }
    }
    
    return group;
}

// 创建输入元素
function createInput(field, prefix) {
    const name = `${prefix}${field.name}`;
    let input;
    let wrapper = null;
    
    if (field.type === 'select') {
        input = document.createElement('select');
        input.name = name;
        input.id = name;
        if (!field.required) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = '-- 请选择 --';
            input.appendChild(option);
        }
        field.options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.label;
            if (field.default === opt.value) {
                option.selected = true;
            }
            input.appendChild(option);
        });
    } else if (field.type === 'checkbox') {
        input = document.createElement('input');
        input.type = 'checkbox';
        input.name = name;
        input.id = name;
        input.checked = field.default || false;
    } else if (field.type === 'number') {
        input = document.createElement('input');
        input.type = 'number';
        input.name = name;
        input.id = name;
        input.value = field.default || '';
        if (field.placeholder) input.placeholder = field.placeholder;
    } else if (field.type === 'date' || field.type === 'datetime-local') {
        // 日期输入包装器
        wrapper = document.createElement('div');
        wrapper.className = 'date-input-wrapper';
        
        input = document.createElement('input');
        input.type = field.type;
        input.name = name;
        input.id = name;
        input.style.paddingRight = '45px';
        
        // 添加日历按钮
        const calendarBtn = document.createElement('button');
        calendarBtn.type = 'button';
        calendarBtn.className = 'date-picker-btn';
        calendarBtn.innerHTML = '📅';
        calendarBtn.title = '打开日历选择器';
        calendarBtn.onclick = (e) => {
            e.preventDefault();
            openDatePicker(input);
        };
        
        wrapper.appendChild(input);
        wrapper.appendChild(calendarBtn);
    } else {
        input = document.createElement('input');
        input.type = field.type || 'text';
        input.name = name;
        input.id = name;
        if (field.placeholder) input.placeholder = field.placeholder;
        if (field.default) input.value = field.default;
    }
    
    if (field.required) {
        if (input) input.required = true;
    }
    
    // 添加输入验证
    if (input && field.type !== 'checkbox') {
        input.addEventListener('blur', () => validateInput(input, field));
        input.addEventListener('input', () => {
            if (input.classList.contains('input-error')) {
                validateInput(input, field);
            }
        });
    }
    
    // 添加输入提示
    if (input && field.placeholder && !wrapper) {
        const hint = document.createElement('div');
        hint.className = 'input-hint';
        hint.textContent = field.placeholder;
        if (wrapper) {
            wrapper.appendChild(hint);
        } else {
            const group = input.closest('.form-group');
            if (group) {
                group.appendChild(hint);
            }
        }
    }
    
    return wrapper || input;
}

// 验证输入
function validateInput(input, field) {
    const value = input.value.trim();
    const errorDiv = input.parentElement.querySelector('.error-text');
    
    // 移除之前的错误提示
    if (errorDiv) {
        errorDiv.remove();
    }
    input.classList.remove('input-error', 'input-success');
    
    // 必填验证
    if (field.required && !value) {
        input.classList.add('input-error');
        const error = document.createElement('div');
        error.className = 'error-text';
        error.textContent = `${field.label}是必填项`;
        input.parentElement.appendChild(error);
        return false;
    }
    
    // 类型验证
    if (value) {
        if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            input.classList.add('input-error');
            const error = document.createElement('div');
            error.className = 'error-text';
            error.textContent = '请输入有效的邮箱地址';
            input.parentElement.appendChild(error);
            return false;
        }
        
        if (field.type === 'number' && isNaN(value)) {
            input.classList.add('input-error');
            const error = document.createElement('div');
            error.className = 'error-text';
            error.textContent = '请输入有效的数字';
            input.parentElement.appendChild(error);
            return false;
        }
        
        // 日期验证
        if ((field.type === 'date' || field.type === 'datetime-local') && value) {
            const date = new Date(value);
            if (isNaN(date.getTime())) {
                input.classList.add('input-error');
                const error = document.createElement('div');
                error.className = 'error-text';
                error.textContent = '请输入有效的日期';
                input.parentElement.appendChild(error);
                return false;
            }
        }
    }
    
    if (value) {
        input.classList.add('input-success');
    }
    
    return true;
}

// 添加数组项
function addArrayItem(field, prefix) {
    const container = document.getElementById(`${prefix}${field.name}_container`);
    if (!container) {
        console.error('Container not found:', `${prefix}${field.name}_container`);
        return;
    }
    
    // 计算当前数组项数量（排除"添加"按钮）
    const existingItems = container.querySelectorAll('.array-item');
    const itemIndex = existingItems.length;
    
    const itemDiv = document.createElement('div');
    itemDiv.className = 'array-item';
    
    const header = document.createElement('div');
    header.className = 'array-item-header';
    const title = document.createElement('div');
    title.className = 'array-item-title';
    title.textContent = `${field.label} #${itemIndex + 1}`;
    header.appendChild(title);
    
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'btn-remove';
    removeBtn.textContent = '删除';
    removeBtn.onclick = () => itemDiv.remove();
    header.appendChild(removeBtn);
    
    itemDiv.appendChild(header);
    
    if (field.fields) {
        // 对象数组
        field.fields.forEach(subField => {
            const subFieldElement = renderField(subField, `${prefix}${field.name}[${itemIndex}].`);
            itemDiv.appendChild(subFieldElement);
        });
    } else {
        // 简单数组
        const input = createInput({ ...field, name: `${field.name}[${itemIndex}]` }, prefix);
        if (input) {
            const inputWrapper = document.createElement('div');
            inputWrapper.style.marginTop = '10px';
            inputWrapper.appendChild(input);
            itemDiv.appendChild(inputWrapper);
        }
    }
    
    // 插入到"添加"按钮之前
    const addButton = container.querySelector('.btn-add');
    if (addButton) {
        container.insertBefore(itemDiv, addButton);
    } else {
        container.appendChild(itemDiv);
    }
}

// 收集表单数据
function collectFormData() {
    const form = document.getElementById('apiForm');
    const formData = new FormData(form);
    const data = {};
    
    // 处理普通字段
    for (let [key, value] of formData.entries()) {
        setNestedValue(data, key, value);
    }
    
    // 处理复选框
    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
        setNestedValue(data, cb.name, cb.checked);
    });
    
    // 处理数组字段
    currentInterface.fields.forEach(field => {
        if (field.type === 'array') {
            const arrayData = collectArrayData(field, '');
            if (arrayData.length > 0 || field.required) {
                setNestedValue(data, field.name, arrayData);
            }
        }
    });
    
    // 清理空值
    return cleanData(data);
}

// 收集数组数据
function collectArrayData(field, prefix) {
    const container = document.getElementById(`${prefix}${field.name}_container`);
    if (!container) return [];
    
    const items = container.querySelectorAll('.array-item');
    return Array.from(items).map((item, index) => {
        if (field.fields) {
            // 对象数组
            const obj = {};
            field.fields.forEach(subField => {
                const input = item.querySelector(`[name*="${field.name}[${index}].${subField.name}"]`);
                if (input) {
                    let value = input.type === 'checkbox' ? input.checked : input.value;
                    if (value !== '' && value !== null && value !== undefined) {
                        obj[subField.name] = convertValue(value, subField.type);
                    }
                }
            });
            return Object.keys(obj).length > 0 ? obj : null;
        } else {
            // 简单数组
            const input = item.querySelector('input, select');
            if (input && input.value) {
                return convertValue(input.value, field.itemType || 'text');
            }
            return null;
        }
    }).filter(item => item !== null);
}

// 设置嵌套值
function setNestedValue(obj, path, value) {
    const keys = path.split('.');
    let current = obj;
    
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        // 处理数组索引
        const arrayMatch = key.match(/^(.+)\[(\d+)\]$/);
        if (arrayMatch) {
            const arrayName = arrayMatch[1];
            const index = parseInt(arrayMatch[2]);
            if (!current[arrayName]) current[arrayName] = [];
            if (!current[arrayName][index]) current[arrayName][index] = {};
            current = current[arrayName][index];
        } else {
            if (!current[key]) current[key] = {};
            current = current[key];
        }
    }
    
    const lastKey = keys[keys.length - 1];
    const arrayMatch = lastKey.match(/^(.+)\[(\d+)\]$/);
    if (arrayMatch) {
        const arrayName = arrayMatch[1];
        const index = parseInt(arrayMatch[2]);
        if (!current[arrayName]) current[arrayName] = [];
        current[arrayName][index] = convertValue(value, 'text');
    } else {
        current[lastKey] = convertValue(value, 'text');
    }
}

// 转换值类型
function convertValue(value, type) {
    if (value === '' || value === null || value === undefined) return undefined;
    
    if (type === 'number') {
        return Number(value);
    } else if (type === 'boolean' || value === true || value === false) {
        return Boolean(value);
    }
    return value;
}

// 清理数据
function cleanData(obj) {
    if (Array.isArray(obj)) {
        return obj.map(cleanData).filter(item => item !== null && item !== undefined && item !== '');
    } else if (obj && typeof obj === 'object') {
        const cleaned = {};
        for (let key in obj) {
            const value = cleanData(obj[key]);
            if (value !== null && value !== undefined && value !== '') {
                cleaned[key] = value;
            }
        }
        return cleaned;
    }
    return obj;
}

// 初始化：等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 绑定接口选择变化事件
    const apiMethodSelect = document.getElementById('apiMethod');
    if (apiMethodSelect) {
        apiMethodSelect.addEventListener('change', loadInterfaceForm);
    }
    
    // 绑定表单提交事件
    const apiForm = document.getElementById('apiForm');
    if (apiForm) {
        apiForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // 验证所有字段
            const isValid = validateAllFields();
            if (!isValid) {
                alert('请检查并填写所有必填字段');
                return;
            }
            
            const method = document.getElementById('apiMethod').value;
            if (!method) return;
            
            const params = collectFormData();
            await callAPI(method, params);
        });
    }
    
    // 初始化日期选择器
    renderCalendar();
});

// 验证所有字段
function validateAllFields() {
    if (!currentInterface) return false;
    
    let isValid = true;
    const form = document.getElementById('apiForm');
    
    currentInterface.fields.forEach(field => {
        const input = form.querySelector(`[name*="${field.name}"]`);
        if (input && field.required) {
            if (!validateInput(input, field)) {
                isValid = false;
            }
        }
    });
    
    return isValid;
}

// 调用API
async function callAPI(method, params) {
    const submitBtn = document.getElementById('submitBtn');
    const statusBadge = document.getElementById('statusBadge');
    const resultArea = document.getElementById('resultArea');
    
    // 显示加载状态
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ 调用中...';
    statusBadge.textContent = '调用中...';
    statusBadge.className = 'status-badge status-loading';
    statusBadge.style.display = 'inline-block';
    
    resultArea.innerHTML = '<div class="loading"><div class="spinner"></div>正在调用接口...</div>';
    
    const startTime = Date.now();
    
    try {
        const response = await fetch('/api/call', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                method: method,
                params: params
            })
        });
        
        const duration = Date.now() - startTime;
        const result = await response.json();
        
        // 显示详细结果
        displayResults(method, params, result, duration, response.status);
        
    } catch (error) {
        const duration = Date.now() - startTime;
        statusBadge.textContent = '错误';
        statusBadge.className = 'status-badge status-error';
        
        resultArea.innerHTML = `
            <div class="error-message">
                ❌ 调用异常: ${error.message}
            </div>
            <div class="result-section">
                <div class="result-section-title">错误详情</div>
                <div class="code-block">${error.stack || error.toString()}</div>
            </div>
            <div class="result-section">
                <div class="result-section-title">请求信息</div>
                <div class="code-block">请求耗时: ${duration}ms</div>
            </div>
        `;
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '🚀 调用接口';
    }
}

// 显示结果
function displayResults(method, params, result, duration, httpStatus) {
    const statusBadge = document.getElementById('statusBadge');
    const resultArea = document.getElementById('resultArea');
    
    const isSuccess = result.code === 0 || result.code === undefined;
    
    statusBadge.textContent = isSuccess ? '成功' : '失败';
    statusBadge.className = `status-badge ${isSuccess ? 'status-success' : 'status-error'}`;
    
    let html = '';
    
    // 请求信息
    html += `
        <div class="result-section">
            <div class="result-section-title">📤 请求信息</div>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">接口方法</div>
                    <div class="info-value">${method}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">HTTP状态</div>
                    <div class="info-value">${httpStatus}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">请求耗时</div>
                    <div class="info-value">${duration}ms</div>
                </div>
                <div class="info-item">
                    <div class="info-label">请求时间</div>
                    <div class="info-value">${new Date().toLocaleString('zh-CN')}</div>
                </div>
            </div>
        </div>
    `;
    
    // 输入参数详情
    html += `
        <div class="result-section">
            <div class="result-section-title">📝 输入参数详情</div>
            ${displayDataTable(params)}
            <div style="margin-top: 15px;">
                <div class="result-section-title" style="font-size: 14px; margin-bottom: 10px;">JSON格式</div>
                <div class="code-block">${JSON.stringify(params, null, 2)}</div>
            </div>
        </div>
    `;
    
    // 响应结果
    if (isSuccess) {
        html += `
            <div class="success-message">
                ✅ 接口调用成功！
            </div>
            <div class="result-section">
                <div class="result-section-title">📊 响应代码</div>
                <div class="code-block">${result.code !== undefined ? result.code : 'N/A'}</div>
            </div>
            <div class="result-section">
                <div class="result-section-title">💬 响应消息</div>
                <div class="code-block">${result.msg || result.message || 'N/A'}</div>
            </div>
        `;
        
        // 响应数据详情
        if (result.data) {
            html += `
                <div class="result-section">
                    <div class="result-section-title">📦 响应数据详情</div>
                    ${displayDataTable(result.data)}
                </div>
            `;
        }
        
        // 完整响应
        html += `
            <div class="result-section">
                <div class="result-section-title">📄 完整响应 (JSON)</div>
                <div class="code-block">${JSON.stringify(result, null, 2)}</div>
            </div>
        `;
    } else {
        html += `
            <div class="error-message">
                ❌ 接口调用失败
            </div>
            <div class="result-section">
                <div class="result-section-title">❌ 错误代码</div>
                <div class="code-block">${result.code}</div>
            </div>
            <div class="result-section">
                <div class="result-section-title">💬 错误消息</div>
                <div class="code-block">${result.msg || result.message || '未知错误'}</div>
            </div>
            <div class="result-section">
                <div class="result-section-title">📄 完整响应</div>
                <div class="code-block">${JSON.stringify(result, null, 2)}</div>
            </div>
        `;
    }
    
    resultArea.innerHTML = html;
}

// 显示数据表格
function displayDataTable(data, depth = 0) {
    if (depth > 3) {
        return `<div class="code-block">${JSON.stringify(data, null, 2)}</div>`;
    }
    
    if (Array.isArray(data)) {
        if (data.length === 0) {
            return '<div style="color: #999; padding: 10px;">空数组</div>';
        }
        
        let html = `<table class="data-table">`;
        // 获取第一个对象的键作为表头
        if (data[0] && typeof data[0] === 'object') {
            const keys = Object.keys(data[0]);
            html += '<thead><tr>';
            html += '<th>索引</th>';
            keys.forEach(key => {
                html += `<th>${key}</th>`;
            });
            html += '</tr></thead><tbody>';
            
            data.forEach((item, index) => {
                html += '<tr>';
                html += `<td><strong>${index}</strong></td>`;
                keys.forEach(key => {
                    const value = item[key];
                    html += `<td>${formatValue(value, depth + 1)}</td>`;
                });
                html += '</tr>';
            });
        } else {
            html += '<thead><tr><th>索引</th><th>值</th></tr></thead><tbody>';
            data.forEach((item, index) => {
                html += `<tr><td><strong>${index}</strong></td><td>${formatValue(item, depth + 1)}</td></tr>`;
            });
        }
        html += '</tbody></table>';
        return html;
    } else if (data && typeof data === 'object') {
        const keys = Object.keys(data);
        if (keys.length === 0) {
            return '<div style="color: #999; padding: 10px;">空对象</div>';
        }
        
        let html = '<table class="data-table"><thead><tr><th>字段名</th><th>字段值</th><th>数据类型</th></tr></thead><tbody>';
        keys.forEach(key => {
            const value = data[key];
            html += '<tr>';
            html += `<td><strong>${key}</strong></td>`;
            html += `<td>${formatValue(value, depth + 1)}</td>`;
            html += `<td><span style="color: #667eea; font-size: 12px;">${getDataType(value)}</span></td>`;
            html += '</tr>';
        });
        html += '</tbody></table>';
        return html;
    } else {
        return `<div class="code-block">${JSON.stringify(data, null, 2)}</div>`;
    }
}

// 格式化值
function formatValue(value, depth = 0) {
    if (value === null) return '<span style="color: #999;">null</span>';
    if (value === undefined) return '<span style="color: #999;">undefined</span>';
    
    if (typeof value === 'object') {
        if (depth < 2) {
            return displayDataTable(value, depth);
        } else {
            return `<div class="code-block" style="margin: 0; padding: 5px; font-size: 11px;">${JSON.stringify(value, null, 2).substring(0, 200)}...</div>`;
        }
    }
    
    if (typeof value === 'string' && value.length > 100) {
        return `<span title="${value}">${value.substring(0, 100)}...</span>`;
    }
    
    return String(value);
}

// 获取数据类型
function getDataType(value) {
    if (value === null) return 'null';
    if (Array.isArray(value)) return `Array[${value.length}]`;
    if (typeof value === 'object') return 'Object';
    return typeof value;
}

// 日期选择器相关
let currentDateInput = null;
let selectedDate = null;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// 打开日期选择器
function openDatePicker(input) {
    currentDateInput = input;
    selectedDate = input.value ? new Date(input.value) : new Date();
    currentMonth = selectedDate.getMonth();
    currentYear = selectedDate.getFullYear();
    
    const modal = document.getElementById('datePickerModal');
    modal.classList.add('show');
    renderCalendar();
}

// 关闭日期选择器
function closeDatePicker() {
    const modal = document.getElementById('datePickerModal');
    modal.classList.remove('show');
    currentDateInput = null;
    selectedDate = null;
}

// 确认日期
function confirmDate() {
    if (currentDateInput && selectedDate) {
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        
        if (currentDateInput.type === 'datetime-local') {
            const hours = String(selectedDate.getHours()).padStart(2, '0');
            const minutes = String(selectedDate.getMinutes()).padStart(2, '0');
            currentDateInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
        } else {
            currentDateInput.value = `${year}-${month}-${day}`;
        }
        
        // 触发change事件
        currentDateInput.dispatchEvent(new Event('change', { bubbles: true }));
        
        // 验证
        const field = getFieldByInput(currentDateInput);
        if (field) {
            validateInput(currentDateInput, field);
        }
    }
    closeDatePicker();
}

// 获取字段定义
function getFieldByInput(input) {
    const name = input.name;
    if (!currentInterface) return null;
    
    // 简单的字段查找逻辑
    for (let field of currentInterface.fields) {
        if (name.includes(field.name)) {
            return field;
        }
    }
    return null;
}

// 渲染日历
function renderCalendar() {
    const calendar = document.getElementById('datePickerCalendar');
    if (!calendar) return;
    
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    
    const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', 
                        '七月', '八月', '九月', '十月', '十一月', '十二月'];
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    
    let html = `
        <div class="calendar">
            <div class="calendar-header">
                <button class="calendar-nav" onclick="changeMonth(-1)">‹</button>
                <div class="calendar-month">${currentYear}年 ${monthNames[currentMonth]}</div>
                <button class="calendar-nav" onclick="changeMonth(1)">›</button>
            </div>
            <div class="calendar-weekdays">
                ${weekdays.map(day => `<div class="calendar-weekday">${day}</div>`).join('')}
            </div>
            <div class="calendar-days">
    `;
    
    // 上个月的日期
    for (let i = firstDay - 1; i >= 0; i--) {
        const date = daysInPrevMonth - i;
        html += `<div class="calendar-day other-month">${date}</div>`;
    }
    
    // 当前月的日期
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        const isToday = date.toDateString() === today.toDateString();
        const isSelected = selectedDate && 
                          date.getDate() === selectedDate.getDate() &&
                          date.getMonth() === selectedDate.getMonth() &&
                          date.getFullYear() === selectedDate.getFullYear();
        const isPast = date < today && !isToday;
        
        let classes = 'calendar-day';
        if (isToday) classes += ' today';
        if (isSelected) classes += ' selected';
        if (isPast) classes += ' disabled';
        
        html += `<div class="${classes}" onclick="selectDate(${day})" ${isPast ? 'style="cursor: not-allowed;"' : ''}>${day}</div>`;
    }
    
    // 下个月的日期
    const totalCells = 42; // 6行 x 7列
    const remainingCells = totalCells - (firstDay + daysInMonth);
    for (let day = 1; day <= remainingCells; day++) {
        html += `<div class="calendar-day other-month">${day}</div>`;
    }
    
    html += `
            </div>
        </div>
    `;
    
    calendar.innerHTML = html;
}

// 切换月份
function changeMonth(direction) {
    currentMonth += direction;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
}

// 选择日期
function selectDate(day) {
    const date = new Date(currentYear, currentMonth, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) {
        return; // 不能选择过去的日期
    }
    
    selectedDate = date;
    renderCalendar();
}

// 点击模态框外部关闭
document.addEventListener('click', function(e) {
    const modal = document.getElementById('datePickerModal');
    if (e.target === modal) {
        closeDatePicker();
    }
});

