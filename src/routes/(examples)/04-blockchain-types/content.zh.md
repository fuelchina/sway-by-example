# Blockchain Types

在Sway中，地址、合约ID和身份是用于处理区块链上不同实体的关键概念。

1. **地址（Address）**：
   - 地址是区块链上用于标识外部拥有账户（EOA）的标识符。
   - 在Sway中，地址可以通过将一个256位的值转换为一个`Address`类型来创建。
   - 地址也可以转换回一个256位的值。
2. **合约ID（Contract ID）**：
   - 合约ID是区块链上用于标识智能合约的唯一标识符。
   - 与地址类似，合约ID可以通过将一个256位的值转换为一个`ContractId`类型来创建。
   - 合约ID也可以转换回一个256位的值。
3. **身份（Identity）**：
   - 身份是一个枚举类型，它可以表示一个地址或一个合约ID。
   - 你可以使用`Identity::Address`或`Identity::ContractId`来创建一个身份。
   - 身份类型可以在模式匹配中使用，以根据其具体类型执行不同的操作。

在上述代码中，我们定义了一个名为`MyContract`的智能合约，其中包含一个名为`test_func`的函数，该函数返回一个`Identity`类型的值。

- 创建了一个地址`addr`，并将其转换为一个`b256`类型的值。
- 创建了一个合约ID`my_contract_id`，并将其转换为一个`b256`类型的值。
- 创建了一个身份`my_id`，它是一个地址类型的身份。
- 使用模式匹配来检查`my_id`的具体类型，并根据其类型执行不同的操作。

这个智能合约的`test_func`函数最终返回了一个身份类型的值。这个简单的例子旨在向你展示如何在Sway中使用地址、合约ID和身份类型。希望这个教程能帮助你更好地理解Sway中的这些关键概念。