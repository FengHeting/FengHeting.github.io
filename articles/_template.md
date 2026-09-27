---
category: generic
name: 设备名称（必填）
brand: 品牌
model: 型号
type: 类型（如：微处理器 / 寻呼机 / 模拟示波器 / 单板计算机）
manufacturer: 制造商
year: 生产年份
origin: 产地
serial: 序列号
chip: 主要芯片
chip_state: 状态
frequency: 工作频率
frequency_state: 状态
interfaces: 接口
interfaces_state: 状态
voltage: 工作电压
voltage_state: 状态
status: 当前状态（用于首页卡片标识，如：在藏）
images: 01.jpg, 02.jpg（图片文件名，放 assets/img/设备目录/ 下，第一个为主图）
captions: 图片说明（与 images 一一对应）
---

这里填写文章正文（Markdown 格式，可自由扩展，长短不限）。

## 类别与详细技术参数模板

在 Front Matter 的 `category:` 中填写设备类别。**各大类的详细技术参数全部使用该大类的公共模板**
（无类别专属概念）；详情页会把模板的**全部参数项渲染出来**，未填写的项显示「（无）」，方便预览和维护。
「基本信息」对所有类别固定一致：品牌 / 型号 / 类型 / 制造商 / 生产年份 / 产地 / 序列号。

**每个参数项都可以附带状态信息**：在参数名后加 `_state` 写出该参数的来源或确认程度
（如 `bandwidth: 20MHz` 配 `bandwidth_state: 铭牌`），页面会在参数值后以绿色括号标注。
状态可写：铭牌 / 面板 / 丝印 / 标签 / 实物 / 板载 / 机身标注 / 待确认 / 未知 等。
**一个参数一个项**：不要把多个参数堆进同一个字段；接口（USB / 视频 / 音频 / 串口等）统一填在 `interfaces` 一项。

### 各大类详细技术参数模板（公共模板，固定）

| category | 类别 | 详细技术参数项 |
|---|---|---|
| `cpu` | 微处理器 | chip 主要芯片 / arch 处理器架构 / instruction 指令集 / clock 主频 / fpu 协处理器·浮点单元 / cache 缓存 / transistor 晶体管数量 / process 制程 / package 封装 / pins 引脚数 / data_bus 数据总线 / addr_bus 地址总线 / max_memory 最大寻址 / registers 寄存器 / voltage 工作电压 / power 功耗 / temperature 工作温度 / condition 品相 |
| `computer` | 计算机 / 服务器 | chip 主要芯片 / chipset 芯片组 / arch 处理器架构 / clock 主频 / core 核心·线程 / ram 内存 / ram_type 内存类型 / storage 存储 / gpu 显示核心 / os 操作系统 / display_out 显示输出 / audio 音频 / network 网络通信 / interfaces 接口 / expansion_slot 扩展插槽 / power_in 电源输入 / voltage 工作电压 / power 功耗 / dimensions 尺寸 / weight 重量 / temperature 工作温度 / condition 品相 |
| `board` | 开发板 / 单板机 | chip 主要芯片 / arch 处理器架构 / clock 主频 / ram 内存 / storage 存储 / os 操作系统 / debug 调试接口 / display_out 显示输出 / audio 音频 / network 网络通信 / wireless 无线通信 / interfaces 接口 / gpio GPIO / expansion_pin 扩展排针 / power_in 电源输入 / voltage 工作电压 / power 功耗 / dimensions 尺寸 / weight 重量 / temperature 工作温度 / condition 品相 |
| `industrial` | 工业控制设备 | chip 主要芯片 / arch 处理器架构 / clock 主频 / ram 内存 / storage 存储 / os 操作系统 / display_out 显示输出 / audio 音频 / network 网络通信 / wireless 无线通信 / interfaces 接口 / io 数字 I/O / power_in 电源输入 / voltage 工作电压 / power 功耗 / temperature 工作温度 / protection 防护等级 / watchdog 看门狗 / dimensions 尺寸 / weight 重量 / condition 品相 |
| `radio` | 无线电设备 / 对讲机 / 发射机 | chip 主要芯片 / frequency 工作频率 / band 频段 / mode 工作模式 / tx_power 发射功率 / modulation 调制方式 / channel 信道数 / step 信道间隔 / impedance 天线阻抗 / display 显示屏 / interfaces 接口 / voltage 工作电压 / power 功耗 / dimensions 尺寸 / weight 重量 / temperature 工作温度 / condition 品相 |
| `pager` | 寻呼机 | chip 主要芯片 / frequency 工作频率 / band 频段 / encoding 编码制式 / protocol 寻呼协议 / display 显示屏 / display_type 显示类型 / memory 信息存储 / alert 提示方式 / battery 电池 / battery_type 电池型号 / standby 待机时间 / voltage 工作电压 / dimensions 尺寸 / weight 重量 / condition 品相 |
| `camera` | 摄像机 / 影像设备 | chip 主要芯片 / sensor 传感器 / sensor_size 传感器尺寸 / lens 镜头 / focal 焦距 / aperture 光圈 / zoom 变焦 / format 影像格式 / resolution 分辨率 / frame_rate 帧率 / audio 音频 / ir 红外夜视 / low_light 最低照度 / shutter 快门 / white_balance 白平衡 / interfaces 接口 / voltage 工作电压 / power 功耗 / dimensions 尺寸 / weight 重量 / condition 品相 |
| `instrument` | 电子仪器（含计算器） | chip 主要芯片 / display 显示 / display_type 显示类型 / interfaces 接口 / voltage 工作电压 / power 功耗 / dimensions 尺寸 / weight 重量 / temperature 工作温度 / condition 品相 |
| `storage` | 存储介质 | media 介质类型 / capacity 容量 / speed 速度·时长 / condition 品相 / dimensions 尺寸 / weight 重量 |
| `generic` | 其他电子硬件 | chip 主要芯片 / frequency 工作频率 / communication 通信方式 / interfaces 接口 / voltage 工作电压 / power 功耗 / dimensions 尺寸 / weight 重量 / temperature 工作温度 / condition 品相 |

> 收藏时间、收藏来源、收藏经历、上手体验等内容，请直接写在正文里，
> 页面会按文字量自由扩展，长短不限。
