---
layout: post
title:  "喵喵妙妙塔求解器(Meow Tower Solver)"
date:   2025-12-31 02:40:00 +0800
categories: Puzzle
tags: 游戏
mathjax: true
---


# 喵喵妙妙塔求解器

# Demo

```
left_strings = ['4', '6 1 1', '6 3 1', '6 3 1', '12 1', '4 5 1', '2 6', '10', '11', '7', '1', '4', '1', '9', '2 2 2 2']
top_strings = ['4', '6 1 1', '9 2', '10 1 1', '6 3 1 2', '4 3 1 2', '1 7', '6 2', '6 2', '9 1', '7 2', '8 1', '1', '1 1', '2']
hint_strings = ['3 9', '3 15', '4 7', '6 13']

Solution:

00: 01 02 03 04 05 | 06 07 08 09 10 | 11 12 13 14 15 |
------------------------------------------------------------
01:    02 03 04 05 |                |                |
02: 01 02 03 04 05 | 06          10 |    12          |
03: 01 02 03 04 05 | 06          10 | 11 12    14    |
04: 01 02 03 04 05 | 06          10 | 11 12       15 |
05: 01 02 03 04 05 | 06 07 08 09 10 | 11 12       15 |
------------------------------------------------------------
06:    02 03 04 05 |       08 09 10 | 11 12    14    |
07:       03 04    |       08 09 10 | 11 12 13       |
08:       03 04 05 | 06 07 08 09 10 | 11 12          |
09:    02 03 04 05 | 06 07 08 09 10 | 11 12          |
10:          04 05 | 06 07 08 09 10 |                |
------------------------------------------------------------
11:                |    07          |                |
12:          04 05 | 06 07          |                |
13:                |    07          |                |
14:       03 04 05 | 06 07 08 09 10 | 11             |
15:    02 03    05 | 06    08 09    | 11 12          |
------------------------------------------------------------

```

## Step 1: Screenshot -> Strings

```
import cv2
import numpy as np
import pytesseract
import os

# Windows 用户请取消注释并确认路径
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def preprocess(roi, scale=4):
    # 1. 放大: 使用 CUBIC 插值，保证字体圆润，不要用 NEAREST (会变锯齿)
    roi = cv2.resize(roi, None, fx=scale, fy=scale, interpolation=cv2.INTER_CUBIC)
    
    # 2. 二值化: 提取亮色文字
    _, binary = cv2.threshold(roi, 160, 255, cv2.THRESH_BINARY)
    
    # 3. 转为白底黑字
    binary = cv2.bitwise_not(binary)
    
    # 4. 适度腐蚀 (让字变细，断开粘连)，但力度不要太大，防止断笔
    kernel = np.ones((3, 3), np.uint8)
    binary = cv2.dilate(binary, kernel, iterations=1)
    
    # 5. 加边框
    binary = cv2.copyMakeBorder(binary, 20, 20, 20, 20, cv2.BORDER_CONSTANT, value=255)
    return binary

def get_horizontal_text_via_box(roi):
    """
    左侧：通过 X 轴坐标判断空格
    """
    # psm 7: Treat the image as a single text line.
    config = r'--oem 3 --psm 7 -c tessedit_char_whitelist=0123456789'
    
    try:
        # 获取字符框
        boxes_str = pytesseract.image_to_boxes(roi, config=config)
    except:
        return None # 失败则回退

    if not boxes_str:
        return None

    boxes = []
    lines = boxes_str.splitlines()
    for line in lines:
        parts = line.split()
        if len(parts) < 4: continue
        # parts: char, left, bottom, right, top, page
        boxes.append({
            'char': parts[0],
            'left': int(parts[1]),
            'right': int(parts[3])
        })

    # 按左坐标排序
    boxes.sort(key=lambda x: x['left'])
    if not boxes: return None

    # 计算平均字符宽度
    total_width = sum(b['right'] - b['left'] for b in boxes)
    avg_width = total_width / len(boxes)
    
    # 间距阈值: 字符宽度的 0.5 倍
    gap_threshold = avg_width * 0.5

    result = boxes[0]['char']
    for i in range(1, len(boxes)):
        gap = boxes[i]['left'] - boxes[i-1]['right']
        if gap > gap_threshold:
            result += " "
        result += boxes[i]['char']
        
    return result

def get_vertical_text_via_box(roi):
    """
    顶部：通过 Y 轴坐标判断换行/空格
    """
    # psm 6: Assume a single uniform block of text.
    config = r'--oem 3 --psm 6 -c tessedit_char_whitelist=0123456789'
    
    h, w = roi.shape[:2]
    try:
        boxes_str = pytesseract.image_to_boxes(roi, config=config)
    except:
        return ""

    if not boxes_str: return ""

    chars = []
    for line in boxes_str.splitlines():
        parts = line.split()
        if len(parts) < 4: continue
        
        # Tesseract 坐标 (0,0 在左下角)
        left, bottom, right, top = int(parts[1]), int(parts[2]), int(parts[3]), int(parts[4])
        
        # 转换为 OpenCV Y (0,0 在左上角) -> 用于排序
        # y_center 越小，说明越靠上
        y_center_img = h - (top + bottom) / 2
        
        chars.append({
            'char': parts[0],
            'y': y_center_img,
            'x': (left + right) / 2,
            'h': top - bottom
        })

    # 1. 核心：按 Y (从上到下) 排序
    chars.sort(key=lambda k: k['y'])

    # 2. 分组逻辑
    avg_h = sum(c['h'] for c in chars) / len(chars)
    y_threshold = avg_h * 0.6 # 同一行判定的阈值

    rows = []
    current_row = [chars[0]]

    for i in range(1, len(chars)):
        diff = abs(chars[i]['y'] - chars[i-1]['y'])
        if diff < y_threshold:
            current_row.append(chars[i])
        else:
            rows.append(current_row)
            current_row = [chars[i]]
    rows.append(current_row)

    # 3. 拼接
    final_tokens = []
    for row in rows:
        # 同一行内按 X 排序 (针对 '10' 这种情况)
        row.sort(key=lambda k: k['x'])
        token = "".join([c['char'] for c in row])
        final_tokens.append(token)

    return " ".join(final_tokens)

def process_image(image_path):
    if not os.path.exists('debug_images'): os.makedirs('debug_images')

    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # 1. 定位 Grid
    _, thresh = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY)
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    if not contours:
        print("Error: Grid not found")
        return

    grid_contour = max(contours, key=cv2.contourArea)
    x, y, w, h = cv2.boundingRect(grid_contour)
    
    rows, cols = 15, 15
    cell_h = h // rows
    cell_w = w // cols
    
    print(f"Grid: {w}x{h}")

    left_strings = []
    top_strings = []
    hint_strings = []

    # --- 处理 Left ---
    print("Processing Left...")
    for i in range(rows):
        roi_x = max(0, x - int(cell_w * 5))
        roi_y = y + i * cell_h + 2
        roi_h_roi = cell_h - 4
        roi_w = x - roi_x
        
        roi = gray[roi_y:roi_y+roi_h_roi, roi_x:roi_x+roi_w]
        
        # 预处理
        processed = preprocess(roi)
        cv2.imwrite(f'debug_images/left_{i}.png', processed) # Debug
        
        # 优先尝试 Box 方法 (解决粘连)
        text = get_horizontal_text_via_box(processed)
        
        # 如果 Box 方法完全没识别到东西 (比如图片太糊)，回退到普通 String 方法
        if text is None:
            config = r'--oem 3 --psm 7 -c tessedit_char_whitelist=0123456789'
            text = pytesseract.image_to_string(processed, config=config).strip()
            # 简单的后处理 hack
            if len(text) == 2 and text[0] != '1' and ' ' not in text: 
                 # 如果识别出 "24" 这种，大概率是 "2 4"
                 pass 
        
        left_strings.append(text if text else "")

    # --- 处理 Top ---
    print("Processing Top...")
    for j in range(cols):
        roi_x = x + j * cell_w + 2
        # 往上多取一点，防止漏字
        roi_y_start = max(0, y - int(cell_h * 9))
        roi_w_roi = cell_w - 4
        
        roi = gray[roi_y_start:y, roi_x:roi_x+roi_w_roi]
        
        # 预处理 (不旋转!)
        processed = preprocess(roi)
        cv2.imwrite(f'debug_images/top_{j}.png', processed) # Debug
        
        # 使用竖排逻辑
        text = get_vertical_text_via_box(processed)
        top_strings.append(text)

    # --- 处理 Hints ---
    print("Processing Hints...")
    for r in range(rows):
        for c in range(cols):
            cx = x + c * cell_w
            cy = y + r * cell_h
            # 取中间一小块，避开线条
            cell = img[cy+7:cy+cell_h-7, cx+7:cx+cell_w-7]
            
            hsv = cv2.cvtColor(cell, cv2.COLOR_BGR2HSV)
            # 灰色/淡紫色 Mask
            mask = cv2.inRange(hsv, np.array([0, 5, 50]), np.array([180, 80, 230]))
            
            if cv2.countNonZero(mask) > 5:
                hint_strings.append(f"{r+1} {c+1}")

    print("\n" + "="*30)
    print(f"left_strings = {left_strings}")
    print(f"top_strings = {top_strings}")
    print(f"hint_strings = {hint_strings}")
    print("="*30)

process_image('unnamed.jpg')
```

## Step 2: Get the solution

```
from ortools.linear_solver import pywraplp
from ortools.sat.python import cp_model

left_strings = ['4', '6 1 1', '6 3 1', '6 3 1', '12 1', '4 5 1', '2 6', '10', '11', '7', '1', '4', '1', '9', '2 2 2 2']
top_strings = ['4', '6 1 1', '9 2', '10 1 1', '6 3 1 2', '4 3 1 2', '1 7', '6 2', '6 2', '9 1', '7 2', '8 1', '1', '1 1', '2']
hint_strings = ['3 9', '3 15', '4 7', '6 13']

def parse_input(s: list[str]) -> list[list[int]]:
    return [list(map(int, line.split())) for line in s]

def compute_ranage(clue, length, i):
    min_start = sum(clue[:i]) + i
    max_start = length - sum(clue[i+1:]) - (len(clue) - i - 1) - clue[i]
    return (min_start, max_start)

def create_cp_constraints(model, x, all_clues, prefix = 'R'):
    num_rows = len(x)
    num_cols = len(x[0])

    for i in range(num_rows):
        # row must have correct number of filled cells
        print(f'{prefix} {i+1} total filled cells: {sum(all_clues[i])}')
        model.Add(sum(x[i][j] for j in range(num_cols)) == sum(all_clues[i]))

    clue_vars = {}
    for i in range(num_rows):
        clues = all_clues[i]
        clue_count = len(clues)
        print(f'{prefix} {i+1} clues: {clues}')
        for j in range(clue_count):
            min_start, max_start = compute_ranage(clues, num_cols, j)
            clue = clues[j]
            before = sum(clues[:j])
            print(f'{prefix} {i+1} clue {j+1} (length {clue}) can start between {min_start} and {max_start}')
            for k in range(min_start, max_start + 1):
                clue_vars[i, j, k] = model.NewBoolVar(f'{prefix}[{i},{j},{k}]')

                # clue can only start if there is enough space
                if k > 0:
                    model.AddAtMostOne([clue_vars[i, j, k], x[i][k - 1]])

                # clue must occupy its length    
                model.Add(sum(x[i][l] for l in range(k,k+clue)) == clue).OnlyEnforceIf(clue_vars[i, j, k])

                # previous clues must fit before
                model.Add(sum(x[i][l] for l in range(0,k)) == before).OnlyEnforceIf(clue_vars[i, j, k])

                # last clue must fit in the row
                if j == clue_count - 1:
                    model.Add(sum(x[i][l] for l in range(k + clue, num_cols)) == 0).OnlyEnforceIf(clue_vars[i, j, k])
            
            # each clue must appear exactly once in the row
            model.AddExactlyOne([clue_vars[i, j, k] for k in range(min_start, max_start + 1)])

    return clue_vars

def create_cp_model(rows, cols, hints = []):
    model = cp_model.CpModel()

    num_rows = len(rows)
    num_cols = len(cols)

    # Create variables
    x = []
    for i in range(num_rows):
        x.append([model.NewBoolVar(f'x[{i},{j}]') for j in range(num_cols)])
    
    for hint in hints:
        r, c = hint
        model.Add(x[r-1][c-1] == 0)

    y = []
    for j in range(num_cols):
        current = []
        for i in range(num_rows):
            current.append(x[i][j])
        y.append(current)

    r_clue_vars = create_cp_constraints(model, x, rows, 'R')
    c_clue_vars = create_cp_constraints(model, y, cols, 'C')

    # Objective
    model.Maximize(sum(x[i][j] for i in range(num_rows) for j in range(num_cols)))

    return model, x, r_clue_vars, c_clue_vars

def solve_cp(rows, cols, hints = []):
    model, x, r_clue_vars, c_clue_vars = create_cp_model(rows, cols, hints)
    solver = cp_model.CpSolver()
    status = solver.solve(model)
    if status != cp_model.OPTIMAL:
        print("The problem does not have an optimal solution.")
        return
    solution = []
    for i in range(len(x)):
        solution.append([solver.Value(x[i][j]) > 0.5 for j in range(len(x[0]))])
    r_clue_solution = {}
    for key in r_clue_vars:
        i, j, k = key
        if solver.Value(r_clue_vars[key]) > 0.5:
            r_clue_solution[i,j] = k
            if not solution[i][k - 1]:
                print(f'R clue {i},{j} starts at {k}, Good!')
            else:
                print(f'R clue {i},{j} starts at {k}, ERROR!')
    c_clue_solution = {}
    for key in c_clue_vars:
        i, j, k = key
        if solver.Value(c_clue_vars[key]) > 0.5:
            c_clue_solution[i,j] = k
    return solution, r_clue_solution, c_clue_solution

def print_solution(solution):
    for i in range(-1, len(solution)):
        line = '%02d:' % (i + 1)
        for j in range(len(solution[0])):
            if solution[i][j] or i == -1:
                line += ' %02d' % (j + 1)
            else:
                line += '   '
            if j % 5 == 4:
                line += ' |'
        print(line)
        if (i + 5) % 5 == 4:
            print('-' * 60)


def solve(row_strings, col_strings, hint_strings = []):
    
    rows = parse_input(row_strings)
    cols = parse_input(col_strings)
    hints = parse_input(hint_strings)

    if sum([sum(r) for r in rows]) != sum([sum(c) for c in cols]):
        print("Error: sum of row clues does not match sum of column clues")
        return
    
    num_rows = len(rows)
    num_cols = len(cols)
    print("%s x %s\n" % (num_rows, num_cols), rows, cols)

    solution, r_clue_solution, c_clue_solution = solve_cp(rows, cols, hints)
    
    print("R clue solution:", r_clue_solution)
    print("C clue solution:", c_clue_solution)
    print_solution(solution)

def main():
    solve(left_strings, top_strings, hint_strings)

if __name__ == "__main__":
    main()
```
