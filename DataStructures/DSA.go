package DataStructures

type Image struct {
	Src     string
	IsVideo bool
}
type Response struct {
	Img         Image
	Links       string
	Description string
}
type Node struct {
	Value Response
	Next  *Node
}
type Links struct {
	Text string
	URL  string
}
type LinksResponse struct {
	Links    Links
	SubLinks []Links
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
func Append(list *LinkedList, value Response) {
	node := &Node{Value: value, Next: nil}
	if list.Head == nil {
		list.Head = node
		list.Tail = list.Head
	} else {
		list.Tail.Next = node
		list.Tail = list.Tail.Next
	}
}
func Pop(list *LinkedList) {
	if list.Head == nil {
		return
	}
	list.Tail = nil
	temp := list.Head
	for temp.Next != nil {
		list.Tail = temp
		temp = temp.Next
	}
}
func Remove(list *LinkedList, idx int) {
	counter := 0
	temp := list.Head
	if idx == 0 {
		list.Head = temp.Next
		return
	}
	for counter < idx-1 {
		temp = temp.Next
		counter++
		if temp == nil {
			return
		}
	}
	if temp.Next == nil {
		Pop(list)
	} else {
		temp.Next = temp.Next.Next
		temp = list.Head
		for temp.Next != nil {
			temp = temp.Next
		}
		list.Tail = temp
	}
}
func AppendList(list *LinkedList, value *LinkedList) {
	if list.Head == nil {
		list = value
		return
	} else if value.Head == nil {
		return
	} else {
		temp2 := value.Head
		for temp2 != nil {
			Append(list, temp2.Value)
			temp2 = temp2.Next
		}
	}
}
func GetResponse(list *LinkedList) []Response {
	temp := list.Head
	var responses []Response
	for temp != nil {
		responses = append(responses, temp.Value)
		temp = temp.Next
	}
	return responses
}
