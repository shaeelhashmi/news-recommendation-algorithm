package Datastructures

type Node struct {
	Value string
	Next  *Node
}

type LinkedList struct {
	Head *Node
	Tail *Node
}

func NewLinkedList() *LinkedList {
	return &LinkedList{
		Head: nil,
		Tail: nil,
	}
}
func Append(list *LinkedList, value string) {
	if list.Head == nil {
		list.Head = &Node{Value: value, Next: nil}
		list.Tail = list.Head
	} else {
		list.Tail.Next = &Node{Value: value, Next: nil}
		list.Tail = list.Tail.Next
	}
}
