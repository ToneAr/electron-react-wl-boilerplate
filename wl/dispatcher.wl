URLDispatcher[
  {
    "/evaluate"~~EndOfString ->
      APIFunction[{"in"->"String"},
        ToExpression[#in]&
      ]
    ,
    "/icon" ->
      Import["D:\\Users\\tonya\\Desktop\\Working\\personal-projects\\personal-project-ELECTRON-TEST-PROJECT\\assets\\icon.png"]
    ,
    ("/evaluate-"~~evaluator:("Python"|"NodeJS"|"Shell")) :>
      APIFunction[{"in"->"String"},
          ExternalEvaluate[evaluator,
            #in
          ]&
      ]
  }
]
