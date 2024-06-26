# Logging

在Sway中，日志记录是一种重要的功能，它允许智能合约在执行过程中记录信息。这些日志记录可以用于调试、审计或监控智能合约的行为。

在代码中，定义一个名为`MyContract`的智能合约，其中包含一个名为`test_func`的函数，该函数接受一个长度为4的字符串作为参数。
- 使用`use`语句来导入`std::logging`模块，该模块提供了日志记录功能。
- 在`test_func`函数中，我们调用了`log`函数，并将传入的字符串作为日志消息。

这个智能合约的`test_func`函数会在执行时记录传入的字符串。这个简单的例子旨在向你展示如何在Sway中使用日志记录来记录智能合约的行为。希望这个教程能帮助你更好地理解Sway中的日志记录功能。
