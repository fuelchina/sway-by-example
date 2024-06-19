# Results

在Sway中，Result类型是一种常用的模式匹配类型，它代表一个操作的结果可能是成功的（Ok）或者失败的（Err）。

在代码中，定义一个名为`MyContract`的智能合约，其中包含一个名为`test_div`的函数，该函数接受两个`u64`类型的参数，并返回一个`u64`类型的值。

- Result类型是Sway中的一种模式匹配类型，它可以包含一个成功的值（Ok）或者一个失败的原因（Err）。
- 在智能合约中，Result类型通常用于处理可能出现错误的情况，如除以零的错误。
- 定义一个`MathError`枚举，用于表示数学运算中可能出现的错误。
- 在`div`函数中，我们检查除数是否为零，如果是，则返回一个包含`MathError::DivByZero`的错误结果。
- 在`test_div`函数中，我们调用`div`函数，并使用模式匹配来处理结果。如果结果是成功的，我们返回值；如果结果是错误的，我们重新抛出错误。

这个智能合约的`test_div`函数最终返回一个`u64`类型的值。这个简单的例子旨在向你展示如何在Sway中使用Result类型来处理可能出现的错误。希望这个教程能帮助你更好地理解Sway中的Result类型。