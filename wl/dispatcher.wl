URLDispatcher[
  {
	"/aliveQ" -> APIFunction[{}, True &], 				(* Use this as a heartbeat test *)
    "/evaluate"~~EndOfString ->
      APIFunction[{"in"->"String"},
        ToExpression[#in]&
      ]
    ,
    ("/evaluate-"~~evaluator:("Python"|"NodeJS"|"Shell")) :>
      APIFunction[{"in"->"String"},
          ExternalEvaluate[evaluator,
            #in
          ]&
      ]
  }
]
